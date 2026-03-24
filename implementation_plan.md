# Goal
Create a modern, responsive web application UI for a Machine Failure Prediction System, matching an existing Google Stitch design. The UI will feature a dark theme with deep navy/electric blue/purple gradients, glassmorphism effects, and custom layouts for Login, Dashboard, Sensor Data, and Alerts.

## User Review Required
> [!IMPORTANT]
> The app will be created using React and Tailwind CSS in a new `frontend` directory within the current workspace to keep it organized alongside the existing backend [app.py](file:///c:/Users/anabia/OneDrive/Pictures/Documents/data%20science/app%202/app.py). 
> Recharts will be used for the sensor data charts, and Lucide React for icons. React Router will be used for navigation. 
> Please approve this plan so I can initialize the project and write the components!

## Proposed Changes
### Frontend Setup
- Create a new Vite React application in the `frontend` directory.
- Install Tailwind CSS and configure it.
- Install `lucide-react` for minimal outline style icons.
- Install `recharts` for interactive line charts and gauge charts.
- Install `react-router-dom` for page navigation.

### Global Styles & Theme
#### [NEW] `frontend/src/index.css`
- Define the primary gradient background (deep navy -> electric blue -> purple).
- Add utility classes for the glassmorphism effect (semi-transparent backgrounds, backdrop blur, soft glowing borders).
- Import modern sans-serif typography (e.g., Inter or Roboto).

### Components & Pages
#### [NEW] `frontend/src/components/Card.jsx`
- Reusable glassmorphic card component with hover animations.
#### [NEW] `frontend/src/components/Button.jsx`
- Reusable button with gradient background and hover effect.
#### [NEW] `frontend/src/components/Sidebar.jsx` and `Navbar.jsx`
- Navigation layout components.
#### [NEW] `frontend/src/pages/Login.jsx`
- Login page with glassmorphism card and gradient button.
#### [NEW] `frontend/src/pages/Dashboard.jsx`
- Machine Health Card, gauge chart, and metrics cards.
#### [NEW] `frontend/src/pages/SensorData.jsx`
- Interactive line charts for Temperature, Pressure, and RPM vs Time.
#### [NEW] `frontend/src/pages/AlertsHistory.jsx`
- List of alerts color-coded by severity, and history table.
#### [MODIFY] `frontend/src/App.jsx`
- Set up React Router wrapper and routes for all pages.

## Verification Plan
### Automated Build
- Run `npm run build` inside the `frontend` folder to ensure the application compiles cleanly.

### Manual Verification
- Start the development server with `npm run dev`.
- Ask the user to open the provided localhost URL in their browser to visually confirm that:
  - The dark gradient background and glassmorphism styling are applied accurately.
  - Navigation between the Dashboard, Sensor Data, and Alerts pages works.
  - The login screen handles rendering properly.
  - Interactive charts function smoothly.
