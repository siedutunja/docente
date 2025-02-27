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
    // 2024-10-21
    {
      path: '/',
      redirect: '/inicio',
      name: 'Inicio',
      component: () => import('@/containers/TheContainer'),
      children: [
        // 2024-10-21
        {
          path: 'inicio',
          //beforeEnter: autenticar,
          component: () => import('@/views/Inicio')
        },
        // 2024-10-26
        {
          path: 'configuracion',
          redirect: '/configuracion/sedesie',  
          name: 'Configuracion',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            // 2024-11-16
            {
              path: 'superadmin',
              beforeEnter: autenticar,
              name: 'Super Administrador',
              component: () => import('@/views/configuracion/SuperAdmin')
            },
          ]
        },
        // 2024-02-17
        {
          path: 'perfiles',
          redirect: '/perfiles/perfilusuario',  
          name: 'Perfiles',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            // 2024-02-17
            {
              path: 'perfilusuario',
              beforeEnter: autenticar,
              name: 'Perfil del Usuario',
              component: () => import('@/views/perfiles/PerfilUsuario')
            },
            // 2024-02-17
            {
              path: 'cambioclave',
              beforeEnter: autenticar,
              name: 'Cambiar Contraseña del Usuario',
              component: () => import('@/views/perfiles/CambioClave')
            },
          ]
        },
        // 2024-10-21
        {
          path: 'restringida',
          component: () => import('@/views/pages/Restringida')
        },    
        // 2024-12-03
        {
          path: 'manuales',
          component: () => import('@/views/pages/Manuales')
        },    
      ]
    },
    // 2024-10-21
    {
      path: "*",
      component: () => import('@/views/pages/Extraviada')
    },
    // 2024-10-21
    {
      path: '/bienvenida',
      component: () => import('@/views/pages/Bienvenida')
    }
  ]
}

