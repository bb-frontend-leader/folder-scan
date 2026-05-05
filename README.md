# 🔎 Folder Scan

🧩 Folder Scan es una aplicación en Node.js que escanea carpetas de forma automática. Utiliza Puppeteer para tomar capturas de pantalla de archivos y ofrece interfaces tanto CLI como API REST.

## ✨ Features

- 📁 **Folder Scanning**: Escaneo recursivo de directorios configurados.
- 📸 **Screenshot Capture**: Capturas automáticas usando Puppeteer.
- ⏰ **Scheduled Scans**: Escaneos diarios programados con cron (por defecto: 5:30 AM).
- 🌐 **REST API**: Servidor Express para acceso programático.
- 📧 **Email Notifications**: Reportes de finalización enviados por correo.
- 📦 **ZIP Support**: Manejo de archivos ZIP con JSZip.

## ⚙️ Prerequisites

- 🟢 **Node.js** (v14 o superior recomendado)
- 📦 **npm** o **yarn**

## 🚀 Installation

1. Clonar el repositorio:
```bash
git clone https://github.com/bb-frontend-leader/folder-scan.git
cd folder-scan
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.template .env
```

✏️ Edita el archivo `.env` con tu configuración (ver sección de [Configuración](#configuration)).

## 🔧 Configuration

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# �️ Puerto del servidor
SERVER_PORT=3001

# 📂 Ruta de la carpeta a escanear
SCAN_FOLDER_PATH='/path/to/scan'

# 💾 Ruta donde se almacenarán los datos
DATA_STORAGE_PATH='./data'

# 📄 Nombre del archivo de salida
DATA_STORAGE_FILE='data.json'

# 🖼️ Ruta donde se guardarán las capturas
SCREENSHOTS_STORAGE_PATH='/path/to/screenshots'

# 🌐 URL base para las capturas
SCREENSHOT_URL_BASE='https://example.com/screenshots/'

# 🔗 URL para los archivos OVA
OVA_URL='https://example.com/ovas/'

# 📧 Servicio de email (gmail, sendgrid, etc.)
MAILER_SERVICE=gmail

# 📨 Dirección de correo del remitente
MAILER_EMAIL=your-email@gmail.com

# 🔑 Clave secreta del servicio de email
# Nota: Para Gmail, necesitas configurar una App Password si tienes 2-Step Verification habilitada
MAILER_SECRET_KEY=your-app-password-here
```

## ▶️ Usage

### 🧪 Development Mode

Ejecuta la aplicación en modo desarrollo con recarga automática:

```bash
npm run dev
```

### 🏗️ Production Mode

1. Compilar el proyecto TypeScript:
```bash
npm run build
```

2. Iniciar la aplicación:
```bash
npm start
```

### 💻 CLI Mode

El CLI se ejecuta automáticamente al iniciar la aplicación y realiza:
- 🔍 Escaneo de la carpeta configurada.
- 📸 Captura de pantallas de los archivos encontrados.
- 💾 Guardado de resultados en `ovas.json`.
- 📧 Envío de notificación por correo al finalizar.

### 🌐 API Server

El servidor Express se inicia automáticamente y expone endpoints REST para interactuar con la aplicación de forma programática.

## 🗂️ Project Structure

```
folder-scan/
├── src/
│   ├── app.ts                    # 🚪 Punto de entrada de la aplicación
│   ├── config/                   # ⚙️ Configuración
│   ├── domain/                   # 🧠 Lógica de negocio
│   │   ├── datasources/
│   │   ├── entities/
│   │   ├── repository/
│   │   └── use-cases/
│   ├── infrastructure/           # 🏗️ Infraestructura
│   │   ├── datasources/
│   │   ├── repositories/
│   │   └── services/             # Puppeteer, Email, Cron
│   └── presentation/             # 🎨 Presentación
│       ├── api/                  # API REST
│       └── cli/                  # CLI
├── dist/                         # 📦 Código compilado
├── .env.template
├── package.json
└── tsconfig.json
```

## 📜 Scripts

- 🛠️ `npm run build` - Compila TypeScript a JavaScript
- ▶️ `npm start` - Construye y ejecuta la aplicación
- 🔁 `npm run dev` - Modo desarrollo con auto-reload

## ⏰ Cron Schedule

La aplicación ejecuta un escaneo automático todos los días a las **3:00 AM** (hora local).
Este valor puede modificarse usando la variable CRON_SCHEDULE en el .env.

## ❤️ Hecho con el 💙 en Books&Books  

Nos enorgullece desarrollar este proyecto como parte del compromiso de **Books&Books** con la educación y la innovación tecnológica. 🌟  

Gracias por visitar nuestro proyecto. ¡Juntos podemos hacer del aprendizaje una experiencia increíble! 🥳✨



