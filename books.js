/* ⚠️ ESTE CÓDIGO FOI DESENVOLVIDO PARA UM AMBIENTE NODE.JS ⚠️ */
const fs = require('fs');
const path = require('path');

let library;
try {
    const rawData = fs.readFileSync(path.join(__dirname, 'library.json'));
    library = JSON.parse(rawData).biblioteca;
} catch (error) {
    console.error("Erro ao carregar library.json:", error);
    library = []; // Fallback to empty library
}

const cookie = {
    visitedMenu: null,
    selectedBook: null,
}

class Book {
    static main(userInput, cookie) {
        
        // Verifica se o usuário já visitou algum menu
        switch (cookie.visitedMenu) {
            case 'firstMenu':
                // Se o usuário visitou o primeiro menu
                if(userInput && !isNaN(parseInt(userInput))){
                    switch (parseInt(userInput)) {
                        case 1:
                            return this.showList();
                        case 2:
                            return this.SearchRequest('byTitle');
                        case 3:
                            return this.SearchRequest('byAuthor');
                        case 4:
                            return this.SearchRequest('byGenre');
                        case 5:
                            this.resetAll()
                            return "Ok, volte sempre!👋";

                        default:
                            return "⚠️ Opção inválida. Por favor, escolha uma opção válida.";
                   }

                }else{
                    return "⚠️ Opção inválida. Por favor, escolha uma opção válida.";
                }

            case 'SearchByTitle':
                // Se o usuário visitou o menu de busca por título
                if (userInput) {
                    return this.SearchByTitle(userInput);
                } else {
                    return "⚠️ Erro ao processar título.";
                }
                
            case 'SearchByAuthor':
                // Se o usuário visitou o menu de busca por autor
                if (userInput) {
                    return this.SearchByAuthor(userInput);
                } else {
                    return "⚠️ Erro ao processar autor.";
                }

            case 'SearchByGenre':
                // Se o usuário visitou o menu de busca por gênero
                if (userInput) {
                    return this.SearchByGenre(userInput);
                } else {
                    return "⚠️ Erro ao processar gênero.";
                }

            default:
                // Se o usuário não visitou nenhum menu, exibir o primeiro menu
                return this.firstMenu();
        }
    }

    //Exibe a primeira mensagem
    static firstMenu(){

        cookie.visitedMenu = 'firstMenu';
        return "👋 Olá, seja bem-vindo à nossa biblioteca virtual! 📚\n" + "Aqui você encontrará uma gigantesca seleção de livros para ler e desfrutar.\n\n" +
            this.formatMenu({
                title: "*Oque deseja para hoje ?* 🫡",
                options: {
                    1: "_Ver lista de livros_ 📝",
                    2: "_Buscar um livro específico_📖",
                    3: "_Buscar obras de um autor_ 🧑‍🦳",
                    4: "_Buscar obras de um gênero_ 🥀",
                    5: '_Sair_'
                }
            })
    }

    //Exibe a lista de livros
    static showList() {
        cookie.visitedMenu = 'showList';
        // Gerar a lista formatada
        const bookList = ("📚 *Lista de Livros Disponíveis:*\n\n" + library.map((book, index) => `${index + 1}. ${book.titulo} - ${book.autor}`).join('\n'))
        // Retornar a lista formatada
        return  bookList;
    }

    static SearchRequest(type){
        switch (type) {
            case 'byTitle':
                cookie.visitedMenu = 'searchByTitle';
                return "Digite o título do livro que deseja buscar:";
            case 'byAuthor':
                cookie.visitedMenu = 'searchByAuthor';
                return "Digite o nome do autor que deseja buscar:";
            case 'byGenre':
                cookie.visitedMenu = 'searchByGenre';
                return "Digite o gênero do livro que deseja buscar:";
            default:
                return "❌ Erro ao processar a solicitação de busca.";
        }
    }

    static SearchByTitle(titulo) {
        const results = library.filter(livro => livro.titulo.toLowerCase() === titulo.toLowerCase());
        if (results.length > 0) {
            return (
                "📖 *Livros Encontrados por Título:*\n\n" +
                results.map((book, index) => `${index + 1}. ${book.titulo} - ${book.autor}`).join('\n')
            );
        } else {
            return "⚠️ Nenhum livro encontrado com esse título.";
        }
    }

    static SearchByAuthor(autor) {
        const results = library.filter(livro => livro.autor.toLowerCase() === autor.toLowerCase());
        if (results.length > 0) {
            return (
                "🧑‍🦳 *Livros Encontrados por Autor:*\n\n" +
                results.map((book, index) => `${index + 1}. ${book.titulo} - ${book.autor}`).join('\n')
            );
        } else {
            return "⚠️ Nenhum livro encontrado para esse autor.";
        }
    }

    static SearchByGenre(genero) {
        const results = library.filter(livro => livro.genero.toLowerCase() === genero.toLowerCase());
        if (results.length > 0) {
            return (
                "🥀 *Livros Encontrados por Gênero:*\n\n" +
                results.map((book, index) => `${index + 1}. ${book.titulo} - ${book.autor}`).join('\n')
            );
        } else {
            return "⚠️ Nenhum livro encontrado nesse gênero.";
        }
    }

    static formatMenu(menuData) {
        let response = `${menuData.title}\n\n`;
        Object.entries(menuData.options).forEach(([key, value]) => {
            response += `${key} - ${value}\n`;
        });
        return response;
    }

    static resetAll(){
        cookie.visitedMenu = null;
        cookie.selectedBook = null;
        return null;
    }
}
module.exports = Book;