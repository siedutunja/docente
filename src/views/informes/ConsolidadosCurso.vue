<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> INFORME CONSOLIDADO POR PERIODO</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="6">
                <b-form-group label="Seleccione Informe:" label-for="datos" class="etiqueta">
                  <b-form-select  id="datos" ref="datos" v-model="idInforme" :options="comboInformes" @change="idPeriodo=null,idCurso=null"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="2">
                <b-form-group label="Periodo:" label-for="periodo" class="etiqueta">
                  <b-form-select id="periodo" ref="periodo" v-model="idPeriodo" :options="comboPeriodos" @change="idCurso=null" :disabled="idInforme!=null ? false : true"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="4">
                <b-form-group label="Seleccione el Curso:" label-for="cursos" class="etiqueta">
                  <b-form-select id="cursos" ref="cursos" v-model="idCurso" :options="comboCursosDirector" @change="consultarMatriculados()" :disabled="idPeriodo!=null ? false : true"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="mt-2" v-if="idCurso!=null">
              <b-col lg="12"><hr></b-col>
              <!-- **************** CONSOLIDADO ASIGNATURAS ************** -->
              <b-col lg="12" v-if="idInforme == 1">
                <div v-if="btnCargando">
                  <div class="text-center m-5 text-primary">
                    <b-spinner style="width: 3rem; height: 3rem;" label="Spinner"></b-spinner>
                    <br><strong>Cargando planilla...</strong>
                  </div>
                </div>
                <div v-else>
                  <vue-good-table ref="table" :columns="encabColumnas" :rows="listaMatriculados" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
                    <div slot="emptystate">
                      <h5 class="text-danger ml-5">No existen estudiantes matriculados</h5>
                    </div>
                  </vue-good-table>
                  <b-row>
                    <b-col lg="12">
                      <b-button class="small mx-1 mt-3" variant="primary" @click="imprimirConsolidado">Imprimir Consolidado</b-button>
                      <vue-excel-xlsx class="small mx-1 mt-3 btn btn-outline-primary" :data="listaMatriculados" :columns="encabColumnas" :file-name="'ConsolidadoNotas-' + new Date().toLocaleDateString()" :file-type="'xlsx'" :sheet-name="'Consolidado'">
                        Exportar Consolidado Evaluaciones a Excel
                      </vue-excel-xlsx>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
            </b-row>
          </b-card-text>
          <template #footer>
            <em>Informes consolidados por curso.</em>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import 'vue-good-table/dist/vue-good-table.css'
  import { VueGoodTable } from 'vue-good-table'

  export default {
    name: 'consolidadoscurso',
    components: {
      VueGoodTable
    },
    data () {
      return {
        idInforme: null,
        comboInformes: [
          { 'value': 1, 'text': 'INFORME CONSOLIDADO DE EVALUACIÓN POR PERIODO Y ASIGNATURA'},
        ],
        comboCursosDirector: [],
        idCurso: null,
        listaMatriculados: [],
        encabColumnas: [],
        listaAsignaturasCurso: [],
        idPeriodo: null,
        comboPeriodos: [],
        nombreSede: null,
        nombreCurso: null,
        btnCargando: true,
        idNivel: null,
        listaTotalesAsignaturas: []
      }
    },
    methods: {
      imprimirConsolidado() {
        // Crear una nueva ventana para imprimir
        const printWindow = window.open("Consolidado", "_blank");

        // Obtener el contenido HTML de la tabla
        const tableHtml = this.$refs.table.$el.querySelector("table").outerHTML;

        // Estilos básicos para la impresión
        const style = `
          <style>
            @media all {
              div.saltopagina{
                display: none;
              }
            }
            @media print{
              div.saltopagina{
                display:block; 
                page-break-before:always;
              }
            }	
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 14px;
              text-align: left;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding-left: 5px;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        `;

        // Insertar el contenido HTML y los estilos en la nueva ventana
        printWindow.document.write(`
          <html>
            <head>
              <title>Consolidado por Curso</title>
              ${style}
            </head>
            <body>
              <p style="text-align: center;">${this.$store.state.nombreInstitucion}<br><b>INFORME CONSOLIDADO DE EVALUACIÓN POR PERIODO - AÑO LECTIVO ${this.$store.state.aLectivo}</b><br>Sede: ${this.nombreSede} | Curso: ${this.nombreCurso} | Periodo: ${this.idPeriodo}</p>
              ${tableHtml}
            </body>
          </html>
        `);

        // Iniciar la impresión y cerrar la ventana
        //printWindow.document.close();
        printWindow.print();
      },
      consultarMatriculados() {
        this.btnCargando = true
        if (this.idInforme == 1) {
          this.consultarConsolidadoAsignaturas()
        }
      },
      async consultarConsolidadoAsignaturas() {
        //this.nombreSede = document.getElementById('sedes')[document.getElementById('sedes').selectedIndex].text
        if (this.idCurso != null) { 
          this.nombreCurso = document.getElementById('cursos')[document.getElementById('cursos').selectedIndex].text
          this.listaAsignaturasCurso = []
          await axios
          .get(CONFIG.ROOT_PATH + 'academico/asignacioncurso', {params: {idCurso: this.idCurso, idInstitucion: this.$store.state.idInstitucion}})
          .then(response => {
            if (response.data.error){
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Lista asignaturas curso')
            } else{
              if (response.data.datos != 0) {
                this.listaAsignaturasCurso = response.data.datos
              }
            }
            //console.log(JSON.stringify(this.listaAsignaturasCurso))
          })
          .catch(err => {
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Lista asignación docentes curso. Intente más tarde.' + err)
          })
          if (this.idNivel == 1) {
            this.encabColumnas = []
            this.encabColumnas.push({label: 'Estudiante', field: 'estudiante', sortable: false})
            this.listaAsignaturasCurso.forEach(element => {
              this.encabColumnas.push({label: element.nemo, field: element.nemo, sortable: false, tdClass: 'text-center'})
            })
            this.listaMatriculados = []
            await axios
            .get(CONFIG.ROOT_PATH + 'academico/estudiantes/curso/consolidadoasignaturas', {params: {idCurso: this.idCurso, periodo: this.idPeriodo}})
            .then(response => {
              if (response.data.error){
                this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - consolidado asignaturas curso')
              } else{
                if (response.data.datos != 0) {
                  //console.log(JSON.stringify(response.data.datos))
                  let datosEstudiante = {}
                  response.data.datos.forEach(element => {         
                    datosEstudiante.estudiante = element.estudiante
                    element.notas.forEach(element2 => {
                      if (element2.orden == 99) {
                        if ( this.$store.state.datosSecciones[0].tipoValComp == 0) {
                          datosEstudiante[element2.nemo] = element2.definitivacompor
                        } else {
                          datosEstudiante[element2.nemo] = Number(element2.definitiva).toFixed(1) == 0 ? '' : Number(element2.definitiva).toFixed(1)
                        }
                      } else {
                        datosEstudiante[element2.nemo] = element2.definitivapree
                      }
                    })
                    this.listaMatriculados.push(JSON.parse(JSON.stringify(datosEstudiante)))
                    //console.log(JSON.stringify(datosEstudiante))
                  })
                }
                setTimeout(()=>{
                  this.btnCargando = false
                },100)
              }
              //console.log(JSON.stringify(this.listaMatriculados))
            })
            .catch(err => {
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: consolidado asignaturas curso. Intente más tarde.' + err)
            })
          } else {
            let bajosAsignatura = {}
            bajosAsignatura.estudiante = 'Total Desempeño Bajo'
            this.encabColumnas = []
            this.encabColumnas.push({label: 'Estudiante', field: 'estudiante', sortable: false})
            this.listaAsignaturasCurso.forEach(element => {
              this.encabColumnas.push({label: element.nemo, field: element.nemo, sortable: false, tdClass: 'text-center'})
              bajosAsignatura[element.nemo] = 0
            })
            this.encabColumnas.push({label: 'BAJ', field: 'bajE', sortable: false, tdClass: 'text-center'})
            this.encabColumnas.push({label: 'BAS', field: 'basE', sortable: false, tdClass: 'text-center'})
            this.encabColumnas.push({label: 'ALT', field: 'altE', sortable: false, tdClass: 'text-center'})
            this.encabColumnas.push({label: 'SUP', field: 'supE', sortable: false, tdClass: 'text-center'})
            this.encabColumnas.push({label: 'Prom', field: 'promedioAsignatura', sortable: false, tdClass: 'text-center'})
            this.encabColumnas.push({label: 'AJ', field: 'ausJ', sortable: false, tdClass: 'text-center'})
            this.encabColumnas.push({label: 'AS', field: 'ausS', sortable: false, tdClass: 'text-center'})
            this.encabColumnas.push({label: 'PST', field: 'puesto', sortable: false, tdClass: 'text-center'})
            this.listaMatriculados = []
            let totalBajos = 0
            let listaPuestos = []
            await axios
            .get(CONFIG.ROOT_PATH + 'academico/estudiantes/curso/consolidadoasignaturas', {params: {idCurso: this.idCurso, periodo: this.idPeriodo}})
            .then(response => {
              if (response.data.error){
                this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - consolidado asignaturas curso')
              } else{
                if (response.data.datos != 0) {
                  //console.log(JSON.stringify(response.data.datos))
                  response.data.datos.forEach(element => {         
                    let contAsignaturas = 0
                    let sumaAsignaturas = 0
                    let bajE = 0
                    let basE = 0
                    let altE = 0
                    let supE = 0
                    let ausJ = 0
                    let ausS = 0
                    let datosEstudiante = {}
                    datosEstudiante.estudiante = element.estudiante
                    datosEstudiante.id = element.id
                    element.notas.forEach(element2 => {
                      if (element2.orden == 99) {
                        if ( this.$store.state.datosSecciones[0].tipoValComp == 0) {
                          datosEstudiante[element2.nemo] = element2.definitivacompor
                        } else {
                          if (isNaN(element2.definitiva) || element2.definitiva === null) {
                            datosEstudiante[element2.nemo] = ''
                          } else {
                            datosEstudiante[element2.nemo] = Number(element2.definitiva).toFixed(1)
                          }
                        }
                      } else {
                        //if (element2.definitiva === 0 || element2.definitiva === null || element2.definitiva === '' || Number(element2.definitiva).toFixed(1) == 0) {
                        if (isNaN(element2.definitiva) || element2.definitiva === null || element2.definitiva < this.$store.state.datosSecciones[0].minBaj) {
                          datosEstudiante[element2.nemo] = null
                        } else {
                          datosEstudiante[element2.nemo] = Number(element2.definitiva).toFixed(1)
                          if (element2.definitiva >= this.$store.state.datosSecciones[0].minBaj && element2.definitiva < this.$store.state.datosSecciones[0].minBas) {
                            bajE++
                            bajosAsignatura[element2.nemo]++
                            totalBajos++
                          } else if (element2.definitiva >= this.$store.state.datosSecciones[0].minBas && element2.definitiva < this.$store.state.datosSecciones[0].minAlt) {
                            basE++
                          } else if (element2.definitiva >= this.$store.state.datosSecciones[0].minAlt && element2.definitiva < this.$store.state.datosSecciones[0].minSup) {
                            altE++
                          } else if (element2.definitiva >= this.$store.state.datosSecciones[0].minSup && element2.definitiva <= this.$store.state.datosSecciones[0].maxSup) {
                            supE++
                          }
                          sumaAsignaturas += element2.definitiva
                          ausJ += Number(element2.ausJ)
                          ausS += Number(element2.ausS)
                          contAsignaturas++
                        }
                      }
                    })
                    if (contAsignaturas > 0) {
                      datosEstudiante.promedioAsignatura = Number(sumaAsignaturas / contAsignaturas).toFixed(1)
                      //sumaPromedios += Number(sumaAsignaturas / contAsignaturas).toFixed(1)
                      datosEstudiante.bajE = bajE
                      datosEstudiante.basE = basE
                      datosEstudiante.altE = altE
                      datosEstudiante.supE = supE
                      datosEstudiante.ausJ = ausJ
                      datosEstudiante.ausS = ausS
                      datosEstudiante.puesto = ''
                    } else {
                      datosEstudiante.promedioAsignatura = Number(0).toFixed(1)
                    }
                    this.listaMatriculados.push(JSON.parse(JSON.stringify(datosEstudiante)))
                    listaPuestos.push({'id': element.id, 'promedio': datosEstudiante.promedioAsignatura})
                    //console.log(JSON.stringify(datosEstudiante))
                  })
                  listaPuestos.sort(((a, b) => b.promedio - a.promedio));
                  //console.log(JSON.stringify(listaPuestos))

                  let numPuesto = 1
                  listaPuestos.forEach(element2 => {
                    this.listaMatriculados.forEach(element => {
                      if (element.id == element2.id) {
                        element.puesto = numPuesto
                        numPuesto++
                      }
                    })
                  })
                  bajosAsignatura.bajE = totalBajos
                  this.listaMatriculados.push(JSON.parse(JSON.stringify(bajosAsignatura)))
                }
                setTimeout(()=>{
                  this.btnCargando = false
                },100)
              }
              //console.log(JSON.stringify(this.listaMatriculados))
            })
            .catch(err => {
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: consolidado asignaturas curso. Intente más tarde!.' + err)
            })
          }
        }
      },
      async ocuparComboCursosDirector() {
        //console.log(JSON.stringify(this.$store.state.listaPlanillasDocente))
        this.comboCursosDirector = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          if (element.orden == 99) {
            this.comboCursosDirector.push({ 'value': element.idCurso, 'text': element.nomenclatura.toUpperCase() })
            this.nombreSede = element.sede
            this.idNivel = element.id_nivel
          }
        })
      },
      async ocuparComboPeriodos() {
        this.comboPeriodos = []
        this.$store.state.datosTablas.periodos.forEach(element => {
          this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
        })
      },
      cancelarFormulario() {
        this.$router.push('/')
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    computed: {
    },
    beforeMount() {
      this.ocuparComboPeriodos()
      this.ocuparComboCursosDirector()
    }
  }
</script>

<style>
  .condensed thead th{
    padding-left:.1em;
    padding-right:.1em;
    font-size: 12px;
    text-align: center;
    /*writing-mode: vertical-lr;
    text-orientation: upright;*/
  }
  .condensed tbody{
    padding-left:.1em;
    padding-right:.1em;
    font-size: 12px;
    text-align: center;
    height: 10px;
  }
  .condensed input{
    padding-left:.1em;
    padding-right:.1em;
    padding-top:.1em;
    padding-bottom:.1em;
    height: 18px;
    font-size: 12px;
    text-align: center;
  }
</style>
