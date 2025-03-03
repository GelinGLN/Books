/* ⚠️ ESTE CÓDIGO FOI DESENVOLVIDO PARA UM AMBIENTE NODE.JS ⚠️ */
const fs = require('fs');
const rawData = fs.readFileSync('./library.json');
const library = JSON.parse(rawData).biblioteca;
const cookie = {
    visitedMenu: null,
    selectedBook: null,
}

class Book {
    static main(userInput, cookie) {
        switch (cookie.visitedMenu) {
            case 'firstMenu':
                if (parseInt(userInput)) {
                    switch (parseInt(userInput)) {
                        case 1: return this.showList();
                        case 2: return this.SearchRequest('byTitle');
                        case 3: return this.SearchRequest('byAuthor');
                        case 4: return this.SearchRequest('byGenre');
                        case 5: this.resetAll(); return "Ok, volte sempre!👋";
                        default: return "⚠️ Opção inválida. Por favor, escolha uma opção válida.";
                    }
                } else {
                    return "⚠️ Opção inválida. Por favor, escolha uma opção válida.";
                }
            case 'SearchByTitle':
                if (userInput) return this.SearchByTitle(userInput);
                return "⚠️ Erro ao processar título.";
            case 'SearchByAuthor':
                if (userInput) return this.SearchByAuthor(userInput);
                return "⚠️ Erro ao processar autor.";
            case 'SearchByGenre':
                if (userInput) return this.SearchByGenre(userInput);
                return "⚠️ Erro ao processar gênero.";
            default:
                return this.firstMenu(); // Corrigido retorno
        }
    }

    static firstMenu() {
        cookie.visitedMenu = 'firstMenu';
        return "👋 Olá, seja bem-vindo à nossa biblioteca virtual! 📚\n" +
               "Aqui você encontrará uma gigantesca seleção de livros para ler e desfrutar.\n\n" +
               this.formatMenu({
                   title: "*O que deseja para hoje?* 🫡", // Corrigido "Oque"
                   options: {
                       1: "_Ver lista de livros_ 📝",
                       2: "_Buscar um livro específico_ 📖",
                       3: "_Buscar obras de um autor_ 🧑‍🦳",
                       4: "_Buscar obras de um gênero_ 🥀",
                       5: '_Sair_'
                   }
               });
    }

    static showList() {
        cookie.visitedMenu = 'showList';
        return "📚 *Lista de Livros Disponíveis:*\n\n" +
               library.map((book, index) => `${index + 1}. ${book.titulo} - ${book.autor}`).join('\n');
    }

    static SearchRequest(type) {
        switch (type) {
            case 'byTitle':
                cookie.visitedMenu = 'SearchByTitle';
                return "Digite o título do livro que deseja buscar:";
            case 'byAuthor':
                cookie.visitedMenu = 'SearchByAuthor';
                return "Digite o nome do autor que deseja buscar:";
            case 'byGenre':
                cookie.visitedMenu = 'SearchByGenre';
                return "Digite o gênero do livro que deseja buscar:";
            default:
                return "❌ Erro ao processar a solicitação de busca.";
        }
    }

    // Função auxiliar para calcular relevância simples
    static calculateRelevance(searchTerm, text) {
        const searchLower = searchTerm.toLowerCase();
        const textLower = text.toLowerCase();
        if (textLower === searchLower) return 100; // Correspondência exata
        if (textLower.startsWith(searchLower)) return 80; // Começa com o termo
        if (textLower.includes(searchLower)) return 50; // Contém o termo
        return 0; // Sem correspondência
    }

    static SearchByTitle(titulo) {
        const results = library
            .map(book => ({
                ...book,
                relevance: this.calculateRelevance(titulo, book.titulo)
            }))
            .filter(book => book.relevance > 0) // Apenas livros relevantes
            .sort((a, b) => b.relevance - a.relevance); // Ordem decrescente de relevância

        if (results.length > 0) {
            return (
                "📖 *Livros Encontrados por Título:*\n\n" +
                results.map((book, index) => `${index + 1}. ${book.titulo} - ${book.autor}`).join('\n')
            );
        }
        return "⚠️ Nenhum livro encontrado com esse título.";
    }

    static SearchByAuthor(autor) {
        const results = library
            .map(book => ({
                ...book,
                relevance: this.calculateRelevance(autor, book.autor)
            }))
            .filter(book => book.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance);

        if (results.length > 0) {
            return (
                "🧑‍🦳 *Livros Encontrados por Autor:*\n\n" +
                results.map((book, index) => `${index + 1}. ${book.titulo} - ${book.autor}`).join('\n')
            );
        }
        return "⚠️ Nenhum livro encontrado para esse autor.";
    }

    static SearchByGenre(genero) {
        const results = library
            .map(book => ({
                ...book,
                relevance: this.calculateRelevance(genero, book.genero)
            }))
            .filter(book => book.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance);

        if (results.length > 0) {
            return (
                "🥀 *Livros Encontrados por Gênero:*\n\n" +
                results.map((book, index) => `${index + 1}. ${book.titulo} - ${book.autor}`).join('\n')
            );
        }
        return "⚠️ Nenhum livro encontrado nesse gênero.";
    }

    static formatMenu(menuData) {
        let response = `${menuData.title}\n\n`;
        Object.entries(menuData.options).forEach(([key, value]) => {
            response += `${key} - ${value}\n`;
        });
        return response;
    }

    static resetAll() {
        cookie.visitedMenu = null;
        cookie.selectedBook = null;
    }
}

module.exports = Book;