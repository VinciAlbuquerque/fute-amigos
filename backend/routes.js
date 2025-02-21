const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const caminhoArquivo = path.join(__dirname, 'partidas.json');

// Função auxiliar para ler o arquivo JSON
const lerPartidas = () => {
    try {
        const data = fs.readFileSync(caminhoArquivo, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler arquivo JSON:', error);
        return [];
    }
};

// Função auxiliar para salvar partidas no arquivo JSON
const salvarPartidas = (partidas) => {
    try {
        fs.writeFileSync(caminhoArquivo, JSON.stringify(partidas, null, 2), 'utf8');
    } catch (error) {
        console.error('Erro ao salvar arquivo JSON:', error);
    }
};

// 🔹 Rota para listar todas as partidas
router.get('/partidas', (req, res) => {
    const partidas = lerPartidas();
    res.json(partidas);
});

// 🔹 Rota para criar uma nova partida
router.post('/partidas', (req, res) => {
    const { titulo, local, data, horario } = req.body;

    if (!titulo || !local || !data || !horario) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    const partidas = lerPartidas();
    const novaPartida = {
        id: partidas.length + 1,
        titulo,
        local,
        data,
        horario,
        jogadores: []
    };

    partidas.push(novaPartida);
    salvarPartidas(partidas);
    res.status(201).json(novaPartida);
});

// 🔹 Rota para adicionar um jogador à lista de presença
router.post('/partidas/:id/jogadores', (req, res) => {
    const { id } = req.params;
    const { nome, telefone } = req.body;

    if (!nome || !telefone) {
        return res.status(400).json({ erro: 'Nome e telefone são obrigatórios!' });
    }

    const partidas = lerPartidas();
    const partida = partidas.find(p => p.id === parseInt(id));

    if (!partida) {
        return res.status(404).json({ erro: 'Partida não encontrada' });
    }

    partida.jogadores.push({ nome, telefone, confirmado: false });
    salvarPartidas(partidas);
    res.json(partida);
});

// 🔹 Rota para confirmar presença de um jogador
router.put('/partidas/:id/jogadores/:indice', (req, res) => {
    const { id, indice } = req.params;
    const partidas = lerPartidas();
    const partida = partidas.find(p => p.id === parseInt(id));

    if (!partida) {
        return res.status(404).json({ erro: 'Partida não encontrada' });
    }

    if (!partida.jogadores[indice]) {
        return res.status(404).json({ erro: 'Jogador não encontrado' });
    }

    partida.jogadores[indice].confirmado = true;
    salvarPartidas(partidas);
    res.json(partida);
});

// 🔹 Rota para excluir uma partida
router.delete('/partidas/:id', (req, res) => {
    const { id } = req.params;
    let partidas = lerPartidas();
    const partidaIndex = partidas.findIndex(p => p.id === parseInt(id));

    if (partidaIndex === -1) {
        return res.status(404).json({ erro: 'Partida não encontrada' });
    }

    partidas.splice(partidaIndex, 1);
    salvarPartidas(partidas);
    res.json({ mensagem: 'Partida removida com sucesso!' });
});

module.exports = router;
