const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /marcas
/**
 * @swagger
 * /marcas:
 *   get:
 *     summary: Lista todas as marcas
 *     tags: [Marcas]
 *     responses:
 *       200:
 *         description: Lista de marcas
 */
router.get('/', async (req, res) => {
    try {
        const marcas = await db('marcas');
        res.status(200).json({ message: 'Lista de marcas', data: marcas, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar marcas', data: [], error: true });
    }
});

// GET /marcas/:id
/**
 * @swagger
 * /marcas/{id}:
 *   get:
 *     summary: Lista a marca pelo id
 *     tags: [Marcas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marca encontrada
 *       404:
 *         description: Marca não encontrada
 */
router.get('/:id', async (req, res) => {
    try {
        const marca = await db('marcas').where('id', req.params.id).first();
        if (!marca) {
            return res.status(404).json({ message: 'Marca não encontrada', data: {}, error: true });
        }
        res.status(200).json({ message: 'Marca encontrada', data: marca, error: false });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar marca', data: {}, error: true });
    }
});

// DELETE /marcas/:id
/**
 * @swagger
 * /marcas/{id}:
 *   delete:
 *     summary: Exclui a marca pelo id
 *     tags: [Marcas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Marca excluída
 *       404:
 *         description: Marca não encontrada
 */
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await db('marcas').where('id', req.params.id).del();
        if (!deleted) {
            return res.status(404).json({ message: 'Marca não encontrada', data: {}, error: true });
        }
        res.status(204).json({ message: 'Marca excluída', data: {}, error: false });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2' || (err.message && err.message.includes('a foreign key constraint fails'))) {
            return res.status(400).json({ message: 'Não é possível excluir uma marca com produtos vinculados.', data: {}, error: true });
        }
        res.status(500).json({ message: 'Erro ao excluir marca', data: {}, error: true });
        console.log(err);
    }
});

module.exports = router;
