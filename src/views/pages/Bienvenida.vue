<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6">
        <div class="w-100">
          <div class="clearfix text-primary">
            <b-card class="text-center">
              <div v-if="!btnHabilitado">
                <div class="text-center m-5">
                  <b-spinner style="width: 3rem; height: 3rem;" label="Spinner"></b-spinner>
                  <br><strong>Cargando configuración...</strong>
                </div>
              </div>
              <div v-else>
                <div class="text-center">
                  <img :src="escudoI + $store.state.escudoInstitucion" height="80"/>
                </div>
                <h4>{{ $store.state.nemoInstitucion }}</h4>
                <h6>INSTITUCIÓN EDUCATIVA {{ $store.state.sectorInstitucion }}</h6>
                <h5 class="text-muted">{{ $store.state.generoUsuario=='M' ? 'BIENVENIDO' : 'BIENVENIDA' }} {{ $store.state.nombre1Usuario }} {{ $store.state.apellido1Usuario }}</h5>
                <b-button type="submit" class="btn mb-2 mt-4" variant="primary" @click="continuar">Continuar</b-button>
              </div>
            </b-card>
          </div>
        </div>
      </CCol>
    </CRow>
  </CContainer> 
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import jwt from 'jsonwebtoken'

  export default {
    name: 'Bienvenida',
    data () {
      return {
        btnHabilitado: false,
        escudoI: null,
        tokenDecodificado: {}
      }
    },
    methods: {
      continuar() {
        this.$router.push('/')
      },
      async trazaProceso(descProceso) {
        let traza = { idUsuario: this.tokenDecodificado.id, descProceso: descProceso, ip: null}
        await axios
        .post(CONFIG.ROOT_PATH + 'docente/trazaproceso', JSON.stringify(traza), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            alert('¡Lo sentimos!, se presento un problema al registrar la traza de la sesión.! Es necesario iniciar una nueva sesión.')
            location.replace(CONFIG.ROOT_WEBSITE)
          }
        })
        .catch(err => {
          alert('Algo salio mal y no se pudo registrar la traza de la Sesión. Intente más tarde. ' + err)
          location.replace(CONFIG.ROOT_WEBSITE)
        })
      },
      async cargarPlanillasDocente() {
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/planillasasignadas/docente', { params: { idInstitucion: this.$store.state.idInstitucion, vigencia: this.$store.state.aLectivo, idDocente: this.$store.state.idDocente }})
        .then(response => {
          if (response.data.error){
            alert(response.data.mensaje + ' - Consulta Asignación Docente')
            location.replace(CONFIG.ROOT_MODULO_LOGIN)
          } else {
            if(response.data.datos != 0) {
              //console.log(JSON.stringify(response.data.datos))
              this.$store.commit('set', ['listaPlanillasDocente', response.data.datos])
            } else {
              this.$store.commit('set', ['listaPlanillasDocente', []])
            }
          }
        })
        .catch(err => {
          alert('Algo salio mal y no se pudo realizar: Consulta Asignación Docente. Intente más tarde. ' + err)
          location.replace(CONFIG.ROOT_WEBSITE)
        })
      },
      async cargarDatosSesionUsuario() {
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/iniciosesion', { params: { idPersona: this.tokenDecodificado.id_persona, idIE: this.tokenDecodificado.id_institucion }})
        .then(response => {
          if (response.data.error){
            alert(response.data.mensaje + ' - Consulta datos del Usuario de la Sesión')
            location.replace(CONFIG.ROOT_MODULO_LOGIN)
          } else{
            //console.log('Sesion: ' + JSON.stringify(response.data.datos))
            if (response.data.datos == 0) {
              alert('¡Lo sentimos!. El Usuario no tiene permisos asignados.')
              location.replace(CONFIG.ROOT_MODULO_LOGIN)
            } else {
              // DATOS USUARIO
              this.$store.commit('set', ['documentoUsuario', response.data.datos.usuario.documento])
              this.$store.commit('set', ['nombre1Usuario', response.data.datos.usuario.nombre1])
              this.$store.commit('set', ['apellido1Usuario', response.data.datos.usuario.apellido1])
              this.$store.commit('set', ['nombre2Usuario', response.data.datos.usuario.nombre2])
              this.$store.commit('set', ['apellido2Usuario', response.data.datos.usuario.apellido2])
              this.$store.commit('set', ['Docente', response.data.datos.usuario.docente])
              if (response.data.datos.usuario.foto == null || response.data.datos.usuario.foto == '') {
                this.$store.commit('set', ['foto', CONFIG.FOTO])
              } else {
                this.$store.commit('set', ['foto', response.data.datos.usuario.foto])
              }
              this.$store.commit('set', ['generoUsuario', response.data.datos.usuario.id_genero])
              this.$store.commit('set', ['telefonoUsuario', response.data.datos.usuario.telefono1])
              this.$store.commit('set', ['correoUsuario', response.data.datos.usuario.correo])
              // DATOS IE
              this.$store.commit('set', ['nombreInstitucion', response.data.datos.ie.institucion])
              this.$store.commit('set', ['nemoInstitucion', response.data.datos.ie.nemo])
              this.$store.commit('set', ['escudoInstitucion', response.data.datos.ie.escudo])
              this.$store.commit('set', ['correoInstitucion', response.data.datos.ie.correo])
              this.$store.commit('set', ['sectorInstitucion', response.data.datos.ie.sector])
              this.$store.commit('set', ['daneInstitucion', response.data.datos.ie.dane])
              this.$store.commit('set', ['nitInstitucion', response.data.datos.ie.nit])
              // DATOS CONFIGURACIÓN IE
              this.$store.commit('set', ['aLectivo', response.data.datos.configuracion.a_lectivo])
              // DATOS DOCENTE
              this.$store.commit('set', ['idDocente', response.data.datos.usuario.idDocente])
              this.$store.commit('set', ['tituloDocente', response.data.datos.usuario.titulo])

              this.cargarPlanillasDocente()
                            
              this.trazaProceso('Inicio de Sesión Docente')
            }
          }
        })
        .catch(err => {
          alert('Algo salio mal y no se pudo realizar: Consulta datos del Usuario de la Sesión. Intente más tarde. ' + err)
          location.replace(CONFIG.ROOT_WEBSITE)
        })
      },
      async cargarDatosTablas() {
        await axios
        .get(CONFIG.ROOT_PATH + 'academico/carguetablas')
        .then(response => {
          if (response.data.error){
            alert(response.data.mensaje + ' - Consulta datos tablas de la Sesión')
            location.replace(CONFIG.ROOT_MODULO_LOGIN)
          } else {
            if(response.data.datos != 0) {
              this.$store.commit('set', ['datosTablas', response.data.datos])
            } else {
              this.$store.commit('set', ['datosTablas', []])
            }
          }
        })
        .catch(err => {
          alert('Algo salio mal y no se pudo realizar: Consulta datos tablas de la Sesión. Intente más tarde. ' + err)
          location.replace(CONFIG.ROOT_WEBSITE)
        })
      },
      async iniciarVista() {
        let token = sessionStorage.getItem('token')
        jwt.verify(token, CONFIG.SECRET_KEY, (err, data) => {
          if (err) {
            alert('¡Lo sentimos!, el token no es válido o el token ha expirado.! Es necesario iniciar una nueva sesión.')
            location.replace(CONFIG.ROOT_WEBSITE)
          } else {
            this.tokenDecodificado = jwt.decode(token)
            //console.log(JSON.stringify(this.tokenDecodificado))
            this.$store.commit('set', ['idUsuario', this.tokenDecodificado.id])
            this.$store.commit('set', ['usuario', this.tokenDecodificado.usuario])
            this.$store.commit('set', ['clave', this.tokenDecodificado.clave])
            this.$store.commit('set', ['idPersona', this.tokenDecodificado.id_persona])
            this.$store.commit('set', ['idRol', this.tokenDecodificado.id_rol])
            this.$store.commit('set', ['idEntorno', this.tokenDecodificado.id_entorno])
            this.$store.commit('set', ['idInstitucion', this.tokenDecodificado.id_institucion])
            this.$store.commit('set', ['idSector', this.tokenDecodificado.id_sector])
            //PERMISOS DEL USUARIO
            /*
            this.$store.commit('set', ['perMatricular', this.tokenDecodificado.permisos.perMatricular])
            this.$store.commit('set', ['perActEstudiante', this.tokenDecodificado.permisos.perActEstudiante])
            this.$store.commit('set', ['perActDocente', this.tokenDecodificado.permisos.perActDocente])
            this.$store.commit('set', ['perActDatosCurso', this.tokenDecodificado.permisos.perActDatosCurso])
            this.$store.commit('set', ['perActDirCurso', this.tokenDecodificado.permisos.perActDirCurso])
            this.$store.commit('set', ['perSecretaria', this.tokenDecodificado.permisos.perSecretaria])
            this.$store.commit('set', ['perAsigCarga', this.tokenDecodificado.permisos.perAsigCarga])
            */
            this.escudoI = CONFIG.ROOT_ESCUDOS
            this.cargarDatosSesionUsuario()
            setTimeout(()=>{
              this.btnHabilitado = true
            },1500)
          }
        })
      }
    },
    beforeMount() {
      this.iniciarVista()
      this.cargarDatosTablas()
    }
  }
</script>
