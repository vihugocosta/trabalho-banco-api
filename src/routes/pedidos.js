const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos (com itens)
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
// GET /pedidos
router.get('/', async (req, res) => {
    try {
        const pedidos = await db('pedidos');
        const pedidosComItens = await Promise.all(pedidos.map(async pedido => {
            const itens = await db('itens_pedido')
                .join('produtos', 'itens_pedido.id_produto', 'produtos.id')
                .where('itens_pedido.id_pedido', pedido.id)
                .select('itens_pedido.*', 'produtos.nome as nome_produto');
            return { ...pedido, itens };
        }));
        res.status(200).json({ message: 'Lista de pedidos', data: pedidosComItens, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar pedidos', data: [], error: true });
    }
});

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Lista o pedido pelo id (com itens)
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
// GET /pedidos/:id
router.get('/:id', async (req, res) => {
    try {
        const pedido = await db('pedidos').where('id', req.params.id).first();
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado', data: {}, error: true });
        }
        const itens = await db('itens_pedido')
            .join('produtos', 'itens_pedido.id_produto', 'produtos.id')
            .where('itens_pedido.id_pedido', pedido.id)
            .select('itens_pedido.*', 'produtos.nome as nome_produto');
        res.status(200).json({ message: 'Pedido encontrado', data: { ...pedido, itens }, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar pedido', data: {}, error: true });
    }
});

/**
 * @swagger
 * /pedidos/cidade/{cidade}:
 *   get:
 *     summary: Lista todos os pedidos de uma cidade (com itens)
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: cidade
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pedidos da cidade
 */
// GET /pedidos/cidade/:cidade
router.get('/cidade/:cidade', async (req, res) => {
    try {
        console.log('Cidade recebida:', req.params.cidade);
        const pedidos = await db('pedidos')
            .join('clientes', 'pedidos.id_cliente', 'clientes.id')
            .where('clientes.cidade', req.params.cidade)
            .select('pedidos.*');
        console.log('Pedidos encontrados:', pedidos);
        const pedidosComItens = await Promise.all(pedidos.map(async pedido => {
            const itens = await db('itens_pedido')
                .join('produtos', 'itens_pedido.id_produto', 'produtos.id')
                .where('itens_pedido.id_pedido', pedido.id)
                .select('itens_pedido.*', 'produtos.nome as nome_produto');
            return { ...pedido, itens };
        }));
        res.status(200).json({ message: 'Pedidos da cidade', data: pedidosComItens, error: false });
    } catch (err) {
        console.log('Erro ao buscar pedidos por cidade:', err);
        res.status(500).json({ message: 'Erro ao buscar pedidos', data: [], error: true, details: err.message });
    }
});

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Gera um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_cliente:
 *                 type: integer
 *               data_pedido:
 *                 type: string
 *                 format: date
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_produto:
 *                       type: integer
 *                     quantidade:
 *                       type: integer
 *           example:
 *             id_cliente: 1
 *             data_pedido: "2025-09-27"
 *             itens:
 *               - id_produto: 2
 *                 quantidade: 3
 *               - id_produto: 5
 *                 quantidade: 1
 *     responses:
 *       201:
 *         description: Pedido cadastrado
 *       500:
 *         description: Erro ao cadastrar pedido
 */
// POST /pedidos
router.post('/', async (req, res) => {
    const { id_cliente, data_pedido, itens } = req.body;
    try {
        // Buscar preços dos produtos
        const produtosIds = itens.map(item => item.id_produto);
        const produtos = await db('produtos').whereIn('id', produtosIds);
        // Calcular valor total
        let valor_total = 0;
        itens.forEach(item => {
            const produto = produtos.find(p => p.id === item.id_produto);
            if (produto) {
                valor_total += produto.preco * item.quantidade;
            }
        });
        const [id_pedido] = await db('pedidos').insert({ id_cliente, data_pedido, valor_total });
        await Promise.all(itens.map(async item => {
            const produto = produtos.find(p => p.id === item.id_produto);
            const preco_unitario = produto ? produto.preco : 0;
            return db('itens_pedido').insert({ ...item, id_pedido, preco_unitario });
        }));
        const pedido = await db('pedidos').where('id', id_pedido).first();
        const itensPedido = await db('itens_pedido')
            .join('produtos', 'itens_pedido.id_produto', 'produtos.id')
            .where('itens_pedido.id_pedido', id_pedido)
            .select('itens_pedido.*', 'produtos.nome as nome_produto');
        res.status(201).json({ message: 'Pedido cadastrado', data: { ...pedido, itens: itensPedido }, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao cadastrar pedido', data: {}, error: true });
        console.log(err);
    }
});

module.exports = router;
