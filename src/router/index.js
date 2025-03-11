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
              path: 'planillaparcial',
              beforeEnter: autenticar,
              name: 'Planilla Parcial por Periodo',
              component: () => import('@/views/evaluaciones/PlanillaParcial')
            },
            // 2025-03-02
            {
              path: 'planillafinal',
              beforeEnter: autenticar,
              name: 'Planilla Final por Periodo',
              component: () => import('@/views/evaluaciones/PlanillaFinal')
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

