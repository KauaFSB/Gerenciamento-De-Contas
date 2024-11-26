document.addEventListener("DOMContentLoaded", () => {
    const newAccountBtn = document.getElementById("new-account-btn");
    const inputContainer = document.getElementById("input-container");
    const fixedAccounts = document.getElementById("fixed-accounts");
    const variableAccounts = document.getElementById("variable-accounts");
    const totalValue = document.getElementById("total-value");
  
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  
    const saveAccounts = () => {
      localStorage.setItem("accounts", JSON.stringify(accounts));
    };
  
    const updateTotal = () => {
      const total = accounts.reduce((sum, account) => sum + account.value, 0);
      totalValue.textContent = `Total: R$${total.toFixed(2)}`;
    };
  
    const checkExpiration = () => {
      const now = new Date();
      accounts.forEach((account, index) => {
        if (account.expirationDate && new Date(account.expirationDate) <= now) {
          accounts.splice(index, 1); 
        }
      });
      saveAccounts();
      displayAccounts();
      updateTotal();
    };
  
    const displayAccounts = () => {
      fixedAccounts.innerHTML = "";
      variableAccounts.innerHTML = "";
  
      accounts.forEach((account, index) => {
        const div = document.createElement("div");
        div.classList.add("list-item");
        div.textContent = `${account.name}: R$${account.value} (${account.type})`;
  
        if (account.expirationDate) {
          const expirationDate = new Date(account.expirationDate).toLocaleDateString();
          div.textContent += ` (Válido até: ${expirationDate})`;
        }
  
        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.classList.add("btn");
        editBtn.addEventListener("click", () => {
          const newName = prompt("Editar Nome:", account.name);
          const newValue = parseFloat(prompt("Editar Valor:", account.value));
          if (newName && !isNaN(newValue)) {
            account.name = newName;
            account.value = newValue;
            saveAccounts();
            displayAccounts();
            updateTotal();
          }
        });
  
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Excluir";
        deleteBtn.classList.add("btn");
        deleteBtn.addEventListener("click", () => {
          if (confirm(`Deseja excluir a conta "${account.name}"?`)) {
            accounts.splice(index, 1);
            saveAccounts();
            displayAccounts();
            updateTotal();
          }
        });
  
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
  
        if (account.type === "Fixa") {
          fixedAccounts.appendChild(div);
        } else {
          variableAccounts.appendChild(div);
        }
      });
  
      updateTotal();
    };
  
    newAccountBtn.addEventListener("click", () => {
      newAccountBtn.disabled = true;
      newAccountBtn.style.backgroundColor = "#6c757d";
      newAccountBtn.style.cursor = "not-allowed";
  
      const inputGroup = document.createElement("div");
      inputGroup.classList.add("input-group");
  
      const nameLabel = document.createElement("label");
      nameLabel.textContent = "Nome da Conta";
      const nameInput = document.createElement("input");
      nameInput.type = "text";
  
      const valueLabel = document.createElement("label");
      valueLabel.textContent = "Valor da Conta";
      const valueInput = document.createElement("input");
      valueInput.type = "number";
  
      const typeLabel = document.createElement("label");
      typeLabel.textContent = "Tipo da Conta";
      const typeSelect = document.createElement("select");
      const optionFixed = document.createElement("option");
      optionFixed.value = "Fixa";
      optionFixed.textContent = "Fixa";
      const optionVariable = document.createElement("option");
      optionVariable.value = "Variável";
      optionVariable.textContent = "Variável";
  
      typeSelect.appendChild(optionFixed);
      typeSelect.appendChild(optionVariable);
  
      const expirationGroup = document.createElement("div");
      expirationGroup.style.display = "none";
  
      const daysLabel = document.createElement("label");
      daysLabel.textContent = "Dias:";
      const daysInput = document.createElement("input");
      daysInput.type = "number";
  
      const monthsLabel = document.createElement("label");
      monthsLabel.textContent = "Meses:";
      const monthsInput = document.createElement("input");
      monthsInput.type = "number";
  
      const yearsLabel = document.createElement("label");
      yearsLabel.textContent = "Anos:";
      const yearsInput = document.createElement("input");
      yearsInput.type = "number";
  
      expirationGroup.append(daysLabel, daysInput, monthsLabel, monthsInput, yearsLabel, yearsInput);
  
      typeSelect.addEventListener("change", () => {
        if (typeSelect.value === "Variável") {
          expirationGroup.style.display = "block";
        } else {
          expirationGroup.style.display = "none";
        }
      });
  
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Salvar Conta";
      saveBtn.classList.add("btn");
  
      saveBtn.addEventListener("click", () => {
        const days = parseInt(daysInput.value) || 0;
        const months = parseInt(monthsInput.value) || 0;
        const years = parseInt(yearsInput.value) || 0;
  
        if (typeSelect.value === "Variável" && days === 0 && months === 0 && years === 0) {
          alert("Por favor, preencha pelo menos uma das opções de validade (dias, meses ou anos).");
          return;
        }
  
        const account = {
          name: nameInput.value,
          value: parseFloat(valueInput.value),
          type: typeSelect.value,
          expirationDate: null,
        };
  
        if (account.type === "Variável") {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + days);
          expirationDate.setMonth(expirationDate.getMonth() + months);
          expirationDate.setFullYear(expirationDate.getFullYear() + years);
          account.expirationDate = expirationDate.toISOString();
        }
  
        if (account.name && !isNaN(account.value)) {
          accounts.push(account);
          saveAccounts();
          displayAccounts();
          updateTotal();
          inputGroup.remove();
  
          
          newAccountBtn.disabled = false;
          newAccountBtn.style.backgroundColor = "#007bff";
          newAccountBtn.style.cursor = "pointer";
        } else {
          alert("Por favor, preencha todos os campos corretamente.");
        }
      });
  
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancelar";
      cancelBtn.classList.add("btn");
      cancelBtn.style.backgroundColor = "#dc3545";
      cancelBtn.style.marginLeft = "0.5rem";
  
      cancelBtn.addEventListener("click", () => {
        inputGroup.remove();
  
        newAccountBtn.disabled = false;
        newAccountBtn.style.backgroundColor = "#007bff";
        newAccountBtn.style.cursor = "pointer";
      });
  
      inputGroup.append(nameLabel, nameInput, valueLabel, valueInput, typeLabel, typeSelect, expirationGroup, saveBtn, cancelBtn);
      inputContainer.appendChild(inputGroup);
    });
  
    setInterval(checkExpiration, 60 * 1000); 
    displayAccounts();
  });
  