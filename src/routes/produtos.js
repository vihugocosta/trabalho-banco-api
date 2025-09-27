const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /produtos
/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/', async (req, res) => {
    try {
        const produtos = await db('produtos');
        res.status(200).json({ message: 'Lista de produtos', data: produtos, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar produtos', data: [], error: true });
    }
});

// GET /produtos/:id
/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Lista o produto pelo id
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const produto = await db('produtos').where('id', req.params.id).first();
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado', data: {}, error: true });
        }
        res.status(200).json({ message: 'Produto encontrado', data: produto, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar produto', data: {}, error: true });
    }
});

// POST /produtos
/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cadastra um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               id_marca:
 *                 type: integer
 *               preco:
 *                 type: number
 *               estoque:
 *                 type: integer
 *           example:
 *             nome: Produto Exemplo
 *             id_marca: 1
 *             preco: 99.90
 *             estoque: 100
 *     responses:
 *       201:
 *         description: Produto cadastrado
 *       500:
 *         description: Erro ao cadastrar produto
 */
router.post('/', async (req, res) => {
    try {
        const [id] = await db('produtos').insert(req.body);
        const novoProduto = await db('produtos').where('id', id).first();
        res.status(201).json({ message: 'Produto cadastrado', data: novoProduto, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao cadastrar produto', data: {}, error: true });
    }
});

module.exports = router;
