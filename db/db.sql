CREATE DATABASE moneytrack;

USE moneytrack;

-- Table for Users and Login
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_date DATETIME NOT NULL
);

-- Table for Income Tax Categories
CREATE TABLE IncomeTax_Categories (
    income_tax_category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    deductible BOOLEAN NOT NULL, -- TRUE if deductible, FALSE otherwise
    description VARCHAR(255)
);

-- Table for Expenses and Transactions
CREATE TABLE Expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    income_tax_category_id INT NOT NULL,
    expense_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    validated_for_tax BOOLEAN DEFAULT FALSE, -- Whether documentation is valid for tax purposes
    invoice_file_path VARCHAR(255), -- Path to the uploaded invoice file

    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (income_tax_category_id) REFERENCES IncomeTax_Categories(income_tax_category_id)
);

-- Table for Fiscal Rules and Limits
CREATE TABLE FiscalRules_Limits (
    rule_id INT AUTO_INCREMENT PRIMARY KEY,
    fiscal_year INT NOT NULL,
    income_tax_category_id INT NOT NULL,
    annual_limit DECIMAL(10, 2), -- Optional, if a limit exists
    monthly_limit DECIMAL(10, 2), -- Optional
    last_updated DATETIME NOT NULL,

    FOREIGN KEY (income_tax_category_id) REFERENCES IncomeTax_Categories(income_tax_category_id),
    UNIQUE (fiscal_year, income_tax_category_id) -- One rule per category per year
);

-- Table for Fiscal Document Validation (CPF/CNPJ)
CREATE TABLE Document_Validation (
    validation_id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL UNIQUE, -- Ensures one validation per expense
    document_type VARCHAR(10) NOT NULL, -- 'CPF' or 'CNPJ'
    document_number VARCHAR(20) NOT NULL,
    validation_status VARCHAR(20) NOT NULL, -- 'Pending', 'Validated', 'Invalid'
    validation_date DATETIME,

    FOREIGN KEY (expense_id) REFERENCES Expenses(expense_id)
);





-- POST Users no insomnia

/*
{
  "name": "Ana Souza",
  "email": "ana.souza@example.com",
  "password": "senha123"
}
{
  "name": "Carlos Lima",
  "email": "carlos.lima@example.com",
  "password": "minhasenha456"
}
{
  "name": "Beatriz Oliveira",
  "email": "beatriz.oliveira@example.com",
  "password": "segura789"
}
*/