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
    /*
    if (tokenDecodificado.id_rol == 1 || tokenDecodificado.id_rol == 12 || tokenPermisos.perSecretaria == 1) {
      menu[0]._children.push(
        {
          _name: 'CSidebarNavDropdown',
          name: 'Secretaría',
          icon: 'cilUserPlus',
          items: []
        }
      )
      indice++
      menu[0]._children[indice].items.push({ name: 'Documentos por Estudiante', to: '/secretaria/buscargenerardocumentos'})
    }
      */

  }
})

export default menu