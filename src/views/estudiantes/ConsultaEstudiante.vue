<template>
  <div>
    <b-row>
      <b-col lg="12">
        <b-card>
          <b-card-text>
            <b-row>
              <b-col lg="12">
                <b-alert class="text-center" :variant="datosFichaE.id_estado_actual==1 ? 'success' : 'danger'" show>
                  <img :src="datosFichaE.foto" id="photo" alt="photo" width="7%" class="float-left">
                  ESTUDIANTE<br><h4 class="mb-0"><b>{{ datosFichaE.estudiante }}</b></h4><span><b>ESTADO: {{ datosFichaE.estado }}</b></span><span v-if="codigo!='' && codigo!=null"><br><strong>CODIGO: {{ codigo }}</strong></span>
                </b-alert>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="12">
                <b-card border-variant="secondary">
                  <b-card-text>
                    <b-row>
                      <b-col lg="12">
                        <b-button-group class="small float-right">
                          <b-button @click="verFichaEstudiante()" class="" variant="success" title="Ver Ficha Estudiante"><b-icon icon="person" aria-hidden="true"></b-icon></b-button>
                          <b-button @click="verFichaPapa()" class="" variant="info" title="Ver Ficha Pápa"><b-icon icon="person-lines-fill" aria-hidden="true"></b-icon></b-button>
                          <b-button @click="verFichaMama()" class="" variant="" style="background: #fd90df; color: white; border-color: #fd90df;" title="Ver Ficha Mamá"><b-icon icon="person-lines-fill" aria-hidden="true"></b-icon></b-button>
                          <b-button @click="verFichaAcudiente()" class="" variant="dark" title="Ver Ficha Acudiente"><b-icon icon="person-check-fill" aria-hidden="true"></b-icon></b-button>
                        </b-button-group>
                        <h5 class="mb-0"><b-icon icon="person" aria-hidden="true"></b-icon> Datos del Estudiante</h5>
                        <hr>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col lg="2" md="6">
                        <div>Número Documento:</div>
                        <div class="etiqueta">{{datosFichaE.documento}}</div>
                      </b-col>
                      <b-col lg="2" md="6">
                        <div>Tipo Documento:</div>
                        <div class="etiqueta">{{datosFichaE.tipodocumento}}</div>
                      </b-col>
                      <b-col lg="2" md="6">
                        <div>Fecha Nace:</div>
                        <div class="etiqueta">{{ datosFichaE.fecha_nacimiento != null ? datosFichaE.fecha_nacimiento.substr(0,10) : '-'}}</div>
                      </b-col>
                      <b-col lg="2" md="6">
                        <div>Municipio:</div>
                        <div class="etiqueta">{{datosFichaE.municipioNac != null ? datosFichaE.municipioNac.toUpperCase() : '-'}}</div>
                      </b-col>
                      <b-col lg="2" md="6">
                        <div>Nacionalidad:</div>
                        <div class="etiqueta">{{datosFichaE.pais}}</div>
                      </b-col>
                      <b-col lg="2" md="6">
                        <div>Género:</div>
                        <div class="etiqueta">{{datosFichaE.genero}}</div>
                      </b-col>
                    </b-row>
                  </b-card-text>
                </b-card>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="12">
                <b-card border-variant="secondary">
                  <b-card-text>
                    <b-row>
                      <b-col lg="12">
                        <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> Datos de la Matrícula</h5>
                        <hr>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col lg="2" md="6">
                        <div>Fecha Matrícula:</div>
                        <div class="etiqueta">{{datosFichaE.creado}}</div>
                      </b-col>
                      <b-col lg="2" md="6">
                        <div>Año Lectivo:</div>
                        <div class="etiqueta">{{datosFichaE.vigencia}}</div>
                      </b-col>
                      <b-col lg="4" md="6">
                        <div>Sede:</div>
                        <div class="etiqueta">{{ datosFichaE.sede}}</div>
                      </b-col>
                      <b-col lg="2" md="6">
                        <div>Grado-Curso:</div>
                        <div class="etiqueta">{{datosFichaE.nomenclatura}}</div>
                      </b-col>
                      <b-col lg="2" md="6">
                        <div>Jornada:</div>
                        <div class="etiqueta">{{datosFichaE.jornada}}</div>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col lg="2" md="6">
                        <div>Nuevo:</div>
                        <div class="etiqueta">{{datosFichaE.id_nuevo}}</div>
                      </b-col>
                      <b-col lg="2" md="6">
                        <div>Repitente:</div>
                        <div class="etiqueta">{{datosFichaE.id_repitente}}</div>
                      </b-col>
                      <b-col lg="4" md="6">
                        <div>Especialidad:</div>
                        <div class="etiqueta">{{ datosFichaE.especialidad}}</div>
                      </b-col>
                      <b-col lg="4" md="6">
                        <div>Observaciones Matrícula:</div>
                        <div class="etiqueta">{{datosFichaE.obs_matricula}}</div>
                      </b-col>
                    </b-row>
                  </b-card-text>
                </b-card>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <!--
    <b-modal ref="modalFichaMatricula" size="xl" scrollable hide-footer title="Ficha de la Matricula" ok-only>
      <div class="mx-3">
        <div>
          <FichaMatricula :datosMatricula="datosFichaMatricula" @retorno="datosRecibidosMatricula"/>
        </div>
      </div>
    </b-modal>
    -->
    <b-modal ref="modalAsociarAcudiente" size="xl" scrollable hide-footer title="Ficha del Acudiente" ok-only>
      <div class="mx-3">
        <div>
          <FichaAcudiente :datosAcudiente="datosFichaA" @retorno="datosRecibidosAcudiente"/>
        </div>
      </div>
    </b-modal>
    <b-modal ref="modalAsociarMama" size="xl" scrollable hide-footer title="Ficha de la Mamá" ok-only>
      <div class="mx-3">
        <div>
          <FichaMama :datosMama="datosFichaM" @retorno="datosRecibidosMama"/>
        </div>
      </div>
    </b-modal>
    <b-modal ref="modalAsociarPapa" size="xl" scrollable hide-footer title="Ficha del Papá" ok-only>
      <div class="mx-3">
        <div>
          <FichaPapa :datosPapa="datosFichaP" @retorno="datosRecibidosPapa"/>
        </div>
      </div>
    </b-modal>
    <b-modal ref="modalFichaEstudiante" size="xl" scrollable hide-footer title="Ficha del Estudiante" ok-only>
      <div class="mx-3">
        <div>
          <FichaEstudiante :datosEstudiante="datosEstudiante" @retorno="datosRecibidosEstudiante"/>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import { validationMixin } from "vuelidate"
  import { required } from "vuelidate/lib/validators"
  import FichaEstudiante from '@/views/estudiantes/FichaEstudiante'
  import FichaPapa from '@/views/estudiantes/FichaPapa'
  import FichaMama from '@/views/estudiantes/FichaMama'
  import FichaAcudiente from '@/views/estudiantes/FichaAcudiente'
  /*
  import FichaMatricula from '@/views/estudiantes/FichaMatricula'
  */
  export default {
    name: 'carpetamatricula',
    mixins: [validationMixin],
    components: {
      FichaEstudiante,
      FichaPapa,
      FichaMama,
      FichaAcudiente,
      /*
      FichaMatricula
      */
    },
    data () {
      return {
        idMatricula: null,
        codigo: null,
        datosEstudiante: {},
        datosFichaE: {},
        datosFichaA: {},
        datosFichaP: {},
        datosFichaM: {},
        datosFichaMatricula: {},
      }
    },
    methods: {
      verFichaAcudiente() {
        this.datosFichaA.idEstudiante = this.datosFichaE.idEstudiante
        this.datosFichaA.idAcudiente = this.datosFichaE.id_acudiente
        this.datosFichaA.idParentesco = this.datosFichaE.id_parentesco
        this.$refs['modalAsociarAcudiente'].show()
      },
      datosRecibidosAcudiente(retorno) {
        this.$refs['modalAsociarAcudiente'].hide()
      },
      verFichaMama() {
        this.datosFichaM.idEstudiante = this.datosFichaE.idEstudiante
        this.datosFichaM.idMama = this.datosFichaE.id_mama
        this.$refs['modalAsociarMama'].show()
      },
      datosRecibidosMama(retorno) {
        this.$refs['modalAsociarMama'].hide()
      },
      verFichaPapa() {
        this.datosFichaP.idEstudiante = this.datosFichaE.idEstudiante
        this.datosFichaP.idPapa = this.datosFichaE.id_papa
        this.$refs['modalAsociarPapa'].show()
      },
      datosRecibidosPapa(retorno) {
        this.$refs['modalAsociarPapa'].hide()
      },
      verFichaEstudiante() {
        this.datosEstudiante.idEstudiante = this.datosFichaE.idEstudiante
        this.$refs['modalFichaEstudiante'].show()
      },
      datosRecibidosEstudiante(retorno) {
        this.$refs['modalFichaEstudiante'].hide()
      },
      async consultaFichaMatricula() {
        this.datosFichaE = {}
        await axios
        .get(CONFIG.ROOT_PATH + 'academico/matriculas/consultacarpetamatricula', { params: { idMatricula: this.idMatricula }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Consulta Carpeta Matricula')
          } else{
            if (response.data.datos != 0) {
              this.datosFichaE = response.data.datos.estudiante
              if (this.datosFichaE.foto == null || this.datosFichaE.foto == '') {
                this.datosFichaE.foto = CONFIG.FOTO
              }
            } else {
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'No se encontró la Carpeta del Estudiante')
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Consulta Carpeta Matricula. Intente más tarde.' + err)
        })
      },
      imprimirFormulario() {
        //window.open("https://siedutunja.gov.co/php/matriculas/FichaMatricula.php?token=" + this.idMatricula,"_blank")
        window.open("https://siedutunja.gov.co/" + this.$store.state.FichaMatricula + "?token=" + this.idMatricula,"_blank")
        return true
      },
      validateStateR(name) {
        const { $dirty, $error } = this.$v.retiro[name]
        return $dirty ? !$error : null
      },
      cancelarFormulario() {
        this.$router.push('/')
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.idMatricula = this.$store.state.idMatricula
      this.consultaFichaMatricula()
    }
  }
</script>