# Guest Book App

Welcome to the Guest Book App! This is a simple Node.js application built with Express and Sequelize to manage a guest book.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Allow guests to leave messages with their names and comments.
- Store guest book entries in a database using Sequelize.
- View a list of all guest book entries.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js: [Download and install Node.js](https://nodejs.org/)

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/guest-book-app.git
   cd guest-book-app

2. Instal depedency:

   ```bash
   npm i

2. Run migration and seeder:

   ```bash
   npx sequelize db:migrate
   npx sequelize-cli db:seed:all