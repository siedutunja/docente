import Vue from 'vue'
import Router from 'vue-router'
import autenticar from "@/auth/autenticar.js";


Vue.use(Router)
export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    // 2025-03-01
    {
      path: '/',
      redirect: '/inicio',
      name: 'Inicio',
      component: () => import('@/containers/TheContainer'),
      children: [
        // 2025-03-01
        {
          path: 'inicio',
          //beforeEnter: autenticar,
          component: () => import('@/views/Inicio')
        },
        // 2025-03-01
        {
          path: 'descriptores',
          redirect: '/descriptores/generales',  
          name: 'Descriptores',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            // 2025-03-01
            {
              path: 'generales',
              beforeEnter: autenticar,
              name: 'Generales',
              component: () => import('@/views/descriptores/Generales')
            },
            // 2025-03-01
            {
              path: 'complementarios',
              beforeEnter: autenticar,
              name: 'Complementarios',
              component: () => import('@/views/descriptores/Complementarios')
            },
            // 2025-03-01
            {
              path: 'recomendaciones',
              beforeEnter: autenticar,
              name: 'Recomendaciones',
              component: () => import('@/views/descriptores/Recomendaciones')
            },
            // 2025-04-21
            {
              path: 'preescolar',
              beforeEnter: autenticar,
              name: 'Preescolar',
              component: () => import('@/views/descriptores/Preescolar')
            },
            // 2025-05-21
            {
              path: 'logros',
              beforeEnter: autenticar,
              name: 'Logros',
              component: () => import('@/views/descriptores/Logros')
            },
          ]
        },
        // 2025-03-01
        {
          path: 'planillas',
          redirect: '/planillas/asignacionacademica',  
          name: 'Mis Planillas',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            // 2025-03-01
            {
              path: 'asignacionacademica',
              beforeEnter: autenticar,
              name: 'Asignación Académica',
              component: () => import('@/views/planillas/AsignacionAcademica')
            },
            // 2025-03-01
            {
              path: 'listadoscurso',
              beforeEnter: autenticar,
              name: 'Listas Estudiantes',
              component: () => import('@/views/planillas/ListadosCurso')
            },
            // 2025-03-04
            {
              path: 'configurarplanillas',
              beforeEnter: autenticar,
              name: 'Configuración Planillas',
              component: () => import('@/views/planillas/ConfigurarPlanillas')
            },
            // 2025-05-21
            {
              path: 'actividadesacademicas',
              beforeEnter: autenticar,
              name: 'Actividades Académicas',
              component: () => import('@/views/planillas/ActividadesAcademicas')
            },
            // 2025-06-09
            {
              path: 'planillasnotas',
              beforeEnter: autenticar,
              name: 'Auxiliar con Notas',
              component: () => import('@/views/planillas/PlanillasNotas')
            },
          ]
        },
        // 2025-03-02
        {
          path: 'estudiantes',
          redirect: '/estudiantes/buscarestudiante',  
          name: 'Estudiantes',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            // 2025-03-02
            {
              path: 'buscarestudiante',
              beforeEnter: autenticar,
              name: 'Buscar Estudiante',
              component: () => import('@/views/estudiantes/BuscarEstudiante')
            },
            // 2025-03-02
            {
              path: 'consultaestudiante',
              beforeEnter: autenticar,
              name: 'Consulta Estudiante',
              component: () => import('@/views/estudiantes/ConsultaEstudiante')
            },
            // 2025-03-23
            {
              path: 'listaobservadores',
              beforeEnter: autenticar,
              name: 'Observador',
              component: () => import('@/views/estudiantes/ListaObservadores')
            },
            // 2025-03-23
            {
              path: 'observador',
              beforeEnter: autenticar,
              name: 'Observador del Estudiante',
              component: () => import('@/views/estudiantes/Observador')
            },
          ]
        },
        // 2025-03-02
        {
          path: 'evaluaciones',
          redirect: '/evaluaciones/planillaparcial',  
          name: 'Evaluaciones',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            // 2025-03-02
            {
              path: 'planillaparcialperiodo',
              beforeEnter: autenticar,
              name: 'Evaluación Parcial por Periodo',
              component: () => import('@/views/evaluaciones/PlanillaParcialPeriodo')
            },
            // 2025-03-24
            {
              path: 'planillafinalperiodo',
              beforeEnter: autenticar,
              name: 'Resumen Final por Periodo',
              component: () => import('@/views/evaluaciones/PlanillaFinalPeriodo')
            },
            // 2025-04-08
            {
              path: 'planillarecuperacionperiodo',
              beforeEnter: autenticar,
              name: 'Recuperaciones por Periodo',
              component: () => import('@/views/evaluaciones/PlanillaRecuperacionPeriodo')
            },
          ]
        },
        // 2025-03-01
        {
          path: 'perfiles',
          redirect: '/perfiles/perfilusuario',  
          name: 'Perfiles',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            // 2025-03-01
            {
              path: 'perfilusuario',
              beforeEnter: autenticar,
              name: 'Perfil del Usuario',
              component: () => import('@/views/perfiles/PerfilUsuario')
            },
            // 2025-03-01
            {
              path: 'cambioclave',
              beforeEnter: autenticar,
              name: 'Cambiar Contraseña del Usuario',
              component: () => import('@/views/perfiles/CambioClave')
            },
          ]
        },
        // 2024-12-12
        {
          path: 'informes',
          redirect: '/informes/consolidadomatricula',  
          name: 'Informes y Estadísticas',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            // 2025-04-02
            {
              path: 'consolidadoscurso',
              beforeEnter: autenticar,
              name: 'Consolidados Curso',
              component: () => import('@/views/informes/ConsolidadosCurso')
            },
            // 2025-04-24
            {
              path: 'reportesperiodos',
              beforeEnter: autenticar,
              name: 'Reportes por Periodo',
              component: () => import('@/views/informes/ReportesPeriodos')
            },
          ]
        },


        // 2025-03-01
        {
          path: 'restringida',
          component: () => import('@/views/pages/Restringida')
        },    
        // 2025-03-01
        {
          path: 'manuales',
          component: () => import('@/views/pages/Manuales')
        },    
      ]
    },
    // 2025-03-01
    {
      path: "*",
      component: () => import('@/views/pages/Extraviada')
    },
    // 2025-03-01
    {
      path: '/bienvenida',
      component: () => import('@/views/pages/Bienvenida')
    }
  ]
}

