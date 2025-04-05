import * as CONFIG from '@/assets/config.js'
import jwt from 'jsonwebtoken'

let menu = []
let token = sessionStorage.getItem('token')
if ( token == null ) {
  let valores = window.location.search
  let urlParams = new URLSearchParams(valores)
  token = urlParams.get('token')
}
jwt.verify(token, CONFIG.SECRET_KEY, (err, data) => {
  if (err) {
    alert('¡Nav. Lo sentimos, el token no es válido o el token ha expirado.! Es necesario iniciar una nueva sesión.')
    location.replace(CONFIG.ROOT_WEBSITE)
  } else {
    window.history.replaceState({},'','/docente/')
    sessionStorage.setItem('token', token)
    let tokenDecodificado = jwt.decode(token)
    let tokenPermisos = tokenDecodificado.permisos
    //console.log(tokenDecodificado)
    let indice = 0
    menu = [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavTitle',
            _children: ['Menú Principal']
          }
        ]
      }
    ]
    // PLANILLAS
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Mis Planillas',
        icon: 'cilDescription',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Asignación Académica', to: '/planillas/asignacionacademica'})
    menu[0]._children[indice].items.push({ name: 'Configurar Planillas', to: '/planillas/configurarplanillas'})
    // ESTUDIANTES
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Estudiantes',
        icon: 'cilEducation',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Consultar Estudiante', to: '/estudiantes/buscarestudiante'})
    menu[0]._children[indice].items.push({ name: 'Listas y Planillas', to: '/planillas/listadoscurso'})
    menu[0]._children[indice].items.push({ name: 'Observador', to: '/estudiantes/listaobservadores'})
    // EVALUACIONES
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Evaluaciones',
        icon: 'cilCalculator',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Notas Parciales por Periodo', to: '/evaluaciones/planillaparcialperiodo'})
    menu[0]._children[indice].items.push({ name: 'Resumen Final por Periodo', to: '/evaluaciones/planillafinalperiodo'})
    // DESCRIPTORES
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Descriptores',
        icon: 'cilList',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Generales', to: '/descriptores/generales'})
    menu[0]._children[indice].items.push({ name: 'Complementarios', to: '/descriptores/complementarios'})
    //menu[0]._children[indice].items.push({ name: 'Recomendaciones', to: '/descriptores/recomendaciones'})
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Informes y Estadísticas',
        icon: 'cilBarChart',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Consolidados por Periodo', to: '/informes/consolidadoscurso'})
  }
})

export default menu