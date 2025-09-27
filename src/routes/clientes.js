const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
// GET /clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await db('clientes');
        res.status(200).json({ message: 'Lista de clientes', data: clientes, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar clientes', data: [], error: true });
        console.log(err);
    }
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Lista o cliente pelo id
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
// GET /clientes/:id
router.get('/:id', async (req, res) => {
    try {
        const cliente = await db('clientes').where('id', req.params.id).first();
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado', data: {}, error: true });
        }
        res.status(200).json({ message: 'Cliente encontrado', data: cliente, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar cliente', data: {}, error: true });
    }
});

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cadastra um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               cidade:
 *                 type: string
 *           example:
 *             nome: João da Silva
 *             email: joao@email.com
 *             cidade: "São Paulo"
 *     responses:
 *       201:
 *         description: Cliente cadastrado
 *       500:
 *         description: Erro ao cadastrar cliente
 */
// POST /clientes
router.post('/', async (req, res) => {
    try {
        console.log('Body recebido:', req.body);
        const [id] = await db('clientes').insert(req.body);
        const novoCliente = await db('clientes').where('id', id).first();
        res.status(201).json({ message: 'Cliente cadastrado', data: novoCliente, error: false });
    } catch (err) {
        console.log('Erro ao cadastrar cliente:', err);
        res.status(500).json({ message: 'Erro ao cadastrar cliente', data: {}, error: true, details: err.message });
    }
});

module.exports = router;
