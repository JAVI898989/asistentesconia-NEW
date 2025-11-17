import "./global.css";
import "./styles/temario-profesional.css";

// Initialize simple auth system
import "./lib/simpleAuth";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SimpleLogin from "./pages/SimpleLogin";
import Assistants from "./pages/Assistants";
import AssistantDetail from "./pages/AssistantDetail";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import Academias from "./pages/Academias";
import AdminInit from "./components/AdminInit";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminAssistants from "./pages/admin/Assistants";
import AdminAsistentesPublicos from "./pages/admin/AsistentesPublicos";
import AdminAsistentesPro from "./pages/admin/AsistentesPro";
import AdminCursos from "./pages/admin/Cursos";
import AdminAcademias from "./pages/admin/Academias";
import AdminPacks from "./pages/admin/Packs";
import AdminFamilyPacks from "./pages/admin/FamilyPacks";
import AdminPrecios from "./pages/admin/Precios";
import AdminReferidos from "./pages/admin/Referidos";
import AdminConfiguracion from "./pages/admin/Configuracion";
import AdminEstadisticas from "./pages/admin/Estadisticas";
import AdminSoporte from "./pages/admin/Soporte";
import AdminContenido from "./pages/admin/Contenido";
import AdminFundadores from "./pages/admin/Fundadores";
import AdminGestionUsuarios from "./pages/admin/GestionUsuarios";
import AcademiaPanel from "./pages/AcademiaPanel";
import AlumnoPanel from "./pages/AlumnoPanel";
import SmartRedirect from "./components/SmartRedirect";
import NetworkBypass from "./components/NetworkBypass";
import AutoLogin from "./components/AutoLogin";
import AccessControl from "./components/AccessControl";
import StudentPanel from "./components/panels/StudentPanel";
import RoleBasedRouter, { StudentPanelRoute, AcademyPanelRoute } from "./pages/RoleBasedRouter";

import TestRoles from "./pages/TestRoles";
import DebugRedirect from "./pages/DebugRedirect";
import CursosProfesionales from "./pages/CursosProfesionales";
import TemarioAcademicoSimple from "./pages/TemarioAcademicoSimple";
import CursoIndividual from "./pages/CursoIndividual";
import EstudiantePanel from "./pages/EstudiantePanel";
import TemarioProgramacionPDFPage from "./pages/TemarioProgramacionPDF";
import AcademiaPanelSimple from "./pages/AcademiaPanelSimple";
import CurriculumPage from "./pages/CurriculumPage";
import AssistantImageTest from "./pages/AssistantImageTest";
import SyllabusTest from "./pages/SyllabusTest";
import AdminReferrals from "./pages/admin/Referrals";
import CheckoutWithReferrals from "./pages/CheckoutWithReferrals";
import TemporalAITest from "./pages/TemporalAITest";
import AdminAccess from "./pages/AdminAccess";
import TemarioReader from "./pages/TemarioReader";
import PrintView from "./pages/PrintView";
import { initializeCleanup } from "./lib/cleanOldThemes";
import "./lib/executeGuardiaCivilGeneration"; // Auto-execute Guardia Civil generation
import FirebaseDebugInfo from "./components/FirebaseDebugInfo";
import { initializeFirebaseErrorHandling } from "./lib/firebaseErrorHandler";
import { setupQuickTest } from "./lib/miniHealthTest";
import { patchFetchForFullStory } from "./lib/fullStoryBypass";

const queryClient = new QueryClient();

// Clean old themes on app load
try {
  initializeCleanup();
} catch (error) {
  console.warn("Error cleaning old themes:", error);
}

// Initialize Firebase error handling for FullStory conflicts
try {
  initializeFirebaseErrorHandling();
} catch (error) {
  console.warn("Error initializing Firebase error handling:", error);
}

// Patch fetch to auto-bypass FullStory if it interferes
try {
  if (typeof window !== 'undefined') {
    patchFetchForFullStory();
  }
} catch (error) {
  console.warn('Error patching fetch for FullStory:', error);
}

// Setup quick test function for development
try {
  setupQuickTest();
} catch (error) {
  console.warn("Error setting up quick test:", error);
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FirebaseDebugInfo />
      <BrowserRouter>
        <AccessControl>
          <Routes>
            {/* Public routes - no access control needed */}
            <Route path="/" element={<Index />} />
            <Route path="/auto-login" element={<AutoLogin />} />
            <Route path="/redirect" element={<SmartRedirect />} />
            <Route path="/network-bypass" element={<NetworkBypass />} />
            <Route path="/test-roles" element={<TestRoles />} />
            <Route path="/debug-redirect" element={<DebugRedirect />} />
            <Route path="/login" element={<SimpleLogin />} />
            <Route path="/asistentes" element={<Assistants />} />
            <Route path="/asistente/:id" element={<AssistantDetail />} />
            <Route path="/asistente/:assistantId/temario/:topicSlug" element={<TemarioReader />} />
            <Route path="/print/:assistantId/:topicSlug" element={<PrintView />} />
            <Route path="/asistentes-pro" element={<Assistants />} />
            <Route path="/academias" element={<Academias />} />
            <Route path="/cursos" element={<CursosProfesionales />} />
            <Route path="/curso/:courseId" element={<CursoIndividual />} />
            <Route
              path="/temario-programacion-pdf"
              element={<TemarioProgramacionPDFPage />}
            />
            <Route path="/como-funciona" element={<Index />} />
            <Route path="/checkout" element={<CheckoutWithReferrals />} />
            <Route path="/success" element={<Success />} />

            {/* Admin routes - protected by access control */}
            <Route path="/admin/init" element={<AdminInit />} />
            <Route path="/admin/access" element={<AdminAccess />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
            <Route
              path="/admin/gestion-usuarios"
              element={<AdminGestionUsuarios />}
            />
            <Route path="/admin/asistentes" element={<AdminAssistants />} />
            <Route
              path="/admin/asistentes-publicos"
              element={<AdminAsistentesPublicos />}
            />
            <Route
              path="/admin/asistentes-pro"
              element={<AdminAsistentesPro />}
            />
            <Route path="/admin/fundadores" element={<AdminFundadores />} />
            <Route path="/admin/cursos" element={<AdminCursos />} />
            <Route path="/admin/academias" element={<AdminAcademias />} />
            <Route path="/admin/packs" element={<AdminPacks />} />
            <Route path="/admin/family-packs" element={<AdminFamilyPacks />} />
            <Route path="/admin/precios" element={<AdminPrecios />} />
            <Route path="/admin/referidos" element={<AdminReferidos />} />
            <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
            <Route path="/admin/estadisticas" element={<AdminEstadisticas />} />
            <Route path="/admin/soporte" element={<AdminSoporte />} />
            <Route path="/admin/contenido" element={<AdminContenido />} />
            <Route path="/admin/referrals" element={<AdminReferrals />} />

            {/* Academy routes - protected by access control */}
            <Route path="/academia/:slug" element={<AcademiaPanel />} />
            <Route
              path="/panel-academia/:slug"
              element={<AcademiaPanelSimple />}
            />
            <Route path="/academia-panel" element={<AcademyPanelRoute />} />

            {/* Student routes - protected by access control */}
            <Route path="/alumno/:id" element={<AlumnoPanel />} />
            <Route path="/estudiante" element={<StudentPanelRoute />} />

            {/* Role-based auto redirect */}
            <Route path="/mi-panel" element={<RoleBasedRouter />} />

            {/* Other protected routes */}
            <Route path="/curriculum/:id" element={<CurriculumPage />} />
            <Route path="/test-images" element={<AssistantImageTest />} />
            <Route path="/test-syllabus" element={<SyllabusTest />} />
            <Route path="/test-temporal-ai" element={<TemporalAITest />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AccessControl>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
