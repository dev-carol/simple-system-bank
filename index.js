const inquirer = require("inquirer")
const chalk = require('chalk')
const fs = require("fs")

operation()


function operation(){
    inquirer.prompt([
        {
            type:'list',
            name:'action',
            message:'O que você deseja fazer?',
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Saque',
                'Sair'
            ]
        }
    ]).then((answer)=>{
        const action = answer['action']
      if(action === 'Criar Conta'){
        createAccount()
      }else if( action === 'Depositar' ){
        deposite()

      } else if(action === 'Consultar Saldo'){

      }

      else if(action === 'Saque'){
        
    }
    else if(action === 'Sair'){
        console.log(chalk.bgBlue.black('Obrigado por usar o nodeBank'));
        process.exit()
    }
    }).catch((err) => console.log(err))
}


function createAccount(){
 console.log(chalk.bgGreen.black('Estamos felizes que tenha nos escolhido como o seu banco!'));
 console.log(chalk.green('Defina as opções da sua conta a seguir: '));
  buildAccount()
 
}

function buildAccount(){
    inquirer.prompt([
        {
            name:'accountName',
            message: 'Digite um nome para a sua conta:'
        }
    ]).then(answer => {
        const accountName = answer['accountName']
       console.info(accountName)
        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }
        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black('A conta informada já existe, escolha um outro nome único e original '));
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, 
        '{"balance": 0}',
        function(err){
            console.log(err);
        },
        )

        console.log(chalk.green('Ebaa! Sua conta foi criada!'));
        operation()
    }).catch((err) => console.log(err))
}


function deposite(){
    inquirer.prompt([
        {
            name:'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) =>{
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return deposite()
        }
        inquirer.prompt([
           {
            name:'amount',
            message: 'Quanto você deseja depositar?'
           }
        ]).then((answer)=>{
            const amount = answer['amount']
            addAmount(accountName, amount)
            
            operation()
        }).catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}


function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Sorry, essa conta não existe. Tente novamente!'));
        return false
    }
    return true

}

function addAmount(accountName,amount){
 
    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'));
        return deposite()
    }


    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err);
        }
    )
   console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`));

}


function getAccount(accountName){
    const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag:'r'
    })
    return JSON.parse(accountJson)
}