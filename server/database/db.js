const { Sequelize } = require('sequelize');

// Configuração da conexão:
// Sequelize('nome_do_banco', 'usuário', 'senha', { ...opções });
const sequelize = new Sequelize('MoneyTrack', 'Antonio', '10042023', {
    host: 'localhost', // Se estiver rodando na sua máquina
    dialect: 'mysql'   // Diz ao Sequelize qual banco usar
});

// Testar a conexão
async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com MySQL estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

authenticate();

module.exports = sequelize;