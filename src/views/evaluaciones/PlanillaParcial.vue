<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> PLANILLA DE EVALUACIÓN PARCIAL POR PERIODO</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="9">
                <b-form-group label="Seleccione la Planilla:" label-for="asignatura" class="etiqueta">
                  <b-form-select id="asignatura" ref="asignatura" v-model="idPlanilla" :options="comboPlanillas" @change="idPeriodo=null"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="3">
                <b-form-group label="Seleccione el Periodo:" label-for="periodo" class="etiqueta">
                  <b-form-select id="periodo" ref="periodo" v-model="idPeriodo" :options="comboPeriodos" @change="cargarConfiguracionPlanilla()" :disabled="idPlanilla!=null ? false : true"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
            <div v-if="idPeriodo != null">
              <b-row v-if="configuracionPlanilla.estadoC1 == 1">
                <b-col>
                  <vue-good-table ref="notas1" :columns="encabColumnas1" :rows="notasPlanilla" styleClass="vgt-table condensed bordered striped" :line-numbers="true"
                    :select-options="{enabled: true, selectOnCheckboxOnly: true, selectionText: 'Marcados', clearSelectionText: 'Desmarcar', selectAllByGroup: true}">
                    <div slot="selected-row-actions">
                      <b-button class="mr-2" variant="primary" @click="asignarNota()">Asignar Nota <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
                    </div>
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'estudiante'">
                        <span :style="(colorConcepto(props.row.id_estado_actual))"><strong>{{props.row.estudiante}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'estado'">
                        <span :style="(colorConcepto(props.row.id_estado_actual))"><strong>{{props.row.estado}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'n1C1'">
                        <b-form-input v-model="props.row.n1C1" @blur="actualizarItem(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n2C1'">
                        <b-form-input v-model="props.row.n2C1" @blur="actualizarItem(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n3C1'">
                        <b-form-input v-model="props.row.n3C1" @blur="actualizarItem(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n4C1'">
                        <b-form-input v-model="props.row.n4C1" @blur="actualizarItem(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n5C1'">
                        <b-form-input v-model="props.row.n5C1" @blur="actualizarItem(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'definitiva'">
                        <span><strong>{{Number(props.row.definitiva).toFixed(1) > 0 ? Number(props.row.definitiva).toFixed(1) : null}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'concepto'">
                        <span><strong>{{props.row.concepto}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'ausJ'">
                        <b-form-input v-model="props.row.ausJ" @blur="actualizarFallas(props.row)" autocomplete="off" maxlength="3" @keydown="soloNumeros" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'ausS'">
                        <b-form-input v-model="props.row.ausS" @blur="actualizarFallas(props.row)" autocomplete="off" maxlength="3" @keydown="soloNumeros" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                    </template>
                    <div slot="emptystate">
                      <h5 class="text-danger ml-5">No existen estudiantes en la planilla</h5>
                    </div>
                  </vue-good-table>
                  <b-row>
                    <b-col v-if="!botonGuardando">
                      <b-button class="small mx-1 mt-4" variant="primary" @click="botonGuardando = true,guardarPlanillaNoPreescolar()">Guardar Planilla Parcial</b-button>
                      <!--<b-button class="small mx-1 mt-4 float-right" variant="success" @click="procesarPlanila">Procesar y Generar Planilla Final del Periodo</b-button>-->
                    </b-col>
                    <b-col v-else>
                      <b-button class="mx-1 mt-4" variant="primary" disabled>
                        <b-spinner small type="grow"></b-spinner>
                        Guardando la planilla...
                      </b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row v-else-if="configuracionPlanilla.estadoC1 == 2">
                <b-col>
                <b-col>
                  <vue-good-table ref="notas1" :columns="encabColumnas2" :rows="notasPlanilla" styleClass="vgt-table condensed bordered striped"
                    :select-options="{enabled: true, selectOnCheckboxOnly: true, selectionText: 'Marcados', clearSelectionText: 'Desmarcar', selectAllByGroup: true}">
                    <div slot="selected-row-actions">
                      <b-button class="mr-2" variant="primary" @click="asignarNota()">Asignar Nota <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
                    </div>
                    <div slot="emptystate">
                      <h5 class="text-danger ml-5">No existen estudiantes en la planilla</h5>
                    </div>
                  </vue-good-table>
                </b-col>
                </b-col>
              </b-row>
              <b-row v-else>
                <b-col>

                </b-col>
              </b-row>
            </div>
          </b-card-text>
          <template #footer>
            <!--{{notasPlanilla}}-->
            <em>Planilla de Evaluación Parcial por Periodo.</em>
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
    name: 'planillaparcial',
    components: {
      VueGoodTable
    },
    data () {
      return {
        idPlanilla: null,
        comboPlanillas: [],
        idPeriodo: null,
        comboPeriodos: [],
        idCurso: null,
        configuracionPlanilla: {},
        encabezados: {},
        notasPlanilla: [],
        encabColumnas1 : [],
        encabColumnas2 : [],
        botonGuardando: false,
      }
    },
    methods: {
      async guardarPlanillaNoPreescolar() {
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/notas/planilla', JSON.stringify(this.notasPlanilla), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Planilla')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La planilla parcial de evaluaciones se ha guardado satisfactoriamente.')
            this.botonGuardando = false
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Planilla. Intente más tarde. ' + err)
        })
      },
      procesarPlanila() {
      },
      actualizarFallas(item) {
        let indice = this.notasPlanilla.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.ausJ == '' || item.ausJ == null) {
          this.notasPlanilla[indice].ausJ = null
        } else  {
          this.notasPlanilla[indice].ausJ = item.ausJ
        }
        if (item.ausS == '' || item.ausS == null) {
          this.notasPlanilla[indice].ausS = null
        } else  {
          this.notasPlanilla[indice].ausS = item.ausS
        }
      },
      actualizarItem(item) {
        let indice = this.notasPlanilla.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.n1C1 == '' || item.n1C1 == null || item.n1C1 == 0) {
          this.notasPlanilla[indice].n1C1 = null
          item.n1C1 = null
        } else  {
          if (item.n1C1 >= this.configuracionPlanilla.minBaj && item.n1C1 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n1C1 = item.n1C1
          } else {
            this.notasPlanilla[indice].n1C1 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n1C1  + ' no es válida.')
            item.n1C1 = null
          }
        }
        if (item.n2C1 == '' || item.n2C1 == null || item.n2C1 == 0) {
          this.notasPlanilla[indice].n2C1 = null
          item.n2C1 = null
        } else  {
          if (item.n2C1 >= this.configuracionPlanilla.minBaj && item.n2C1 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n2C1 = item.n2C1
          } else {
            this.notasPlanilla[indice].n2C1 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n2C1  + ' no es válida.')
            item.n2C1 = null
          }
        }
        if (item.n3C1 == '' || item.n3C1 == null || item.n3C1 == 0) {
          this.notasPlanilla[indice].n3C1 = null
          item.n3C1 = null
        } else  {
          if (item.n3C1 >= this.configuracionPlanilla.minBaj && item.n3C1 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n3C1 = item.n3C1
          } else {
            this.notasPlanilla[indice].n3C1 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n3C1  + ' no es válida.')
            item.n3C1 = null
          }
        }
        if (item.n4C1 == '' || item.n4C1 == null || item.n4C1 == 0) {
          this.notasPlanilla[indice].n4C1 = null
          item.n4C1 = null
        } else  {
          if (item.n4C1 >= this.configuracionPlanilla.minBaj && item.n4C1 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n4C1 = item.n4C1
          } else {
            this.notasPlanilla[indice].n4C1 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n4C1  + ' no es válida.')
            item.n4C1 = null
          }
        }
        if (item.n5C1 == '' || item.n5C1 == null || item.n5C1 == 0) {
          this.notasPlanilla[indice].n5C1 = null
          item.n5C1 = null
        } else  {
          if (item.n5C1 >= this.configuracionPlanilla.minBaj && item.n5C1 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n5C1 = item.n5C1
          } else {
            this.notasPlanilla[indice].n5C1 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n5C1  + ' no es válida.')
            item.n5C1 = null
          }
        }
        let i = 0
        let sumaNotas = 0
        if (this.notasPlanilla[indice].n1C1 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n1C1)
          i++
        }
        if (this.notasPlanilla[indice].n2C1 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n2C1)
          i++
        }
        if (this.notasPlanilla[indice].n3C1 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n3C1)
          i++
        }
        if (this.notasPlanilla[indice].n4C1 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n4C1)
          i++
        }
        if (this.notasPlanilla[indice].n5C1 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n5C1)
          i++
        }
        if (i == 0) {
          this.notasPlanilla[indice].definitiva = null
        } else {
          this.notasPlanilla[indice].definitiva = Number(Number(Number(sumaNotas) / i) * this.configuracionPlanilla.porcentajeC1 / 100).toFixed(1)
        }
        if (this.notasPlanilla[indice].definitiva >= this.configuracionPlanilla.minBaj && this.notasPlanilla[indice].definitiva < this.configuracionPlanilla.minBas) {
          this.notasPlanilla[indice].concepto = 'BAJO'
        } else if (this.notasPlanilla[indice].definitiva >= this.configuracionPlanilla.minBas && this.notasPlanilla[indice].definitiva < this.configuracionPlanilla.minAlt) {
          this.notasPlanilla[indice].concepto = 'BASICO'
        } else if (this.notasPlanilla[indice].definitiva >= this.configuracionPlanilla.minAlt && this.notasPlanilla[indice].definitiva < this.configuracionPlanilla.minSup) {
          this.notasPlanilla[indice].concepto = 'ALTO'
        } else if (this.notasPlanilla[indice].definitiva >= this.configuracionPlanilla.minSup && this.notasPlanilla[indice].definitiva <= this.configuracionPlanilla.maxSup) {
          this.notasPlanilla[indice].concepto = 'SUPERIOR'
        } else {
          this.notasPlanilla[indice].concepto = null
        }
      },
      async cargarConfiguracionPlanilla() {
        this.configuracionPlanilla = {}
        this.idCurso = null,
        this.$store.state.listaPlanillasDocente.forEach(element => {
          if (element.idPlanilla == this.idPlanilla) {
            this.configuracionPlanilla = element
            this.idCurso = element.idCurso
          }
        })
        //console.log(JSON.stringify(this.configuracionPlanilla))
        this.cargarEncabezados()
      },
      async cargarEncabezados() {
        this.encabezados = {}
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/configuracion/planilla', {params: {idPlanilla: this.idPlanilla, idPeriodo: this.idPeriodo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Encabezados Planilla')
          } else{
            if (response.data.datos != 0) {
              this.encabezados = response.data.datos
              if (this.configuracionPlanilla.id_nivel != 1) {
                this.cargarNotasPeriodoNoPresscolar()
              } else {
                this.cargarNotasPeriodoSiPresscolar()
              }
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Encabezados Planilla. Intente más tarde.' + err)
        })
      },
      cargarNotasPeriodoSiPresscolar() {
        // AQUI SE CONSTRUYE LA PLANILLA DE PREESCOLAR
      },
      async cargarNotasPeriodoNoPresscolar() {
        //console.log(JSON.stringify(this.encabezados))
        this.notasPlanilla = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/notas/planilla', {params: {idCurso: this.idCurso, idPeriodo: this.idPeriodo, idPlanilla: this.idPlanilla}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Notas periodo')
          } else{
            if (response.data.datos != 0) {
              //console.log(JSON.stringify(this.response.data.datos))
              response.data.datos.forEach(element => {
                if(element.n1C1 === undefined) element.n1C1 = null
                if(element.n2C1 === undefined) element.n2C1 = null
                if(element.n3C1 === undefined) element.n3C1 = null
                if(element.n4C1 === undefined) element.n4C1 = null
                if(element.n5C1 === undefined) element.n5C1 = null
                if(element.defC1 === undefined) element.defC1 = null
                if(element.n1C2 === undefined) element.n1C2 = null
                if(element.n2C2 === undefined) element.n2C2 = null
                if(element.n3C2 === undefined) element.n3C2 = null
                if(element.n4C2 === undefined) element.n4C2 = null
                if(element.n5C2 === undefined) element.n5C2 = null
                if(element.defC2 === undefined) element.defC2 = null
                if(element.n1C3 === undefined) element.n1C3 = null
                if(element.n2C3 === undefined) element.n2C3 = null
                if(element.n3C3 === undefined) element.n3C3 = null
                if(element.n4C3 === undefined) element.n4C3 = null
                if(element.n5C3 === undefined) element.n5C3 = null
                if(element.defC3 === undefined) element.defC3 = null
                if(element.ausJ === undefined) element.ausJ = null
                if(element.ausS === undefined) element.ausS = null
                if(element.definitiva === undefined) element.definitiva = null
                if(element.concepto === undefined) element.concepto = null
                element.id_asignatura_curso = this.idPlanilla
                element.periodo = this.idPeriodo
              })
              this.notasPlanilla = response.data.datos
              //console.log(JSON.stringify(this.notasPlanilla))
              this.construirPlanillaNotas()
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Notas periodo. Intente más tarde.' + err)
        })
      },
      async construirPlanillaNotas() {
        let enca1 = ''
        let enca2 = ''
        let enca3 = ''
        let enca4 = ''
        let enca5 = ''
        if (this.configuracionPlanilla.estadoC1 == 1) {
          if (this.encabezados.val01 == 0) {
            if (this.encabezados.enc01 == null || this.encabezados.enc01 == '') this.encabezados.enc01 = 'N1'
            if (this.encabezados.enc02 == null || this.encabezados.enc01 == '') this.encabezados.enc02 = 'N2'
            if (this.encabezados.enc03 == null || this.encabezados.enc01 == '') this.encabezados.enc03 = 'N3'
            if (this.encabezados.enc04 == null || this.encabezados.enc01 == '') this.encabezados.enc04 = 'N4'
            if (this.encabezados.enc05 == null || this.encabezados.enc01 == '') this.encabezados.enc05 = 'N5'
            enca1 = this.encabezados.enc01 + '\n___\nEQ'
            enca2 = this.encabezados.enc02 + '\n___\nEQ'
            enca3 = this.encabezados.enc03 + '\n___\nEQ'
            enca4 = this.encabezados.enc04 + '\n___\nEQ'
            enca5 = this.encabezados.enc05 + '\n___\nEQ'
            this.encabColumnas1 = [
              { label: 'Apellidos y Nombres Estudiante', field: 'estudiante', sortable: false },
              { label: '', field: 'estado', width: '50px', sortable: false },
              { label: enca1, field: 'n1C1', width: '60px', sortable: false },
              { label: enca2, field: 'n2C1', width: '60px', sortable: false },
              { label: enca3, field: 'n3C1', width: '60px', sortable: false },
              { label: enca4, field: 'n4C1', width: '60px', sortable: false },
              { label: enca5, field: 'n5C1', width: '60px', sortable: false },
              { label: this.configuracionPlanilla.nombreC1+'\n*****\n'+this.configuracionPlanilla.porcentajeC1+'%', field: 'definitiva', width: '80px', sortable: false },
              { label: 'Concepto', field: 'concepto', width: '110px', sortable: false },
              { label: 'Justificadas', field: 'ausJ', width: '60px', sortable: false },
              { label: 'Sin justificar', field: 'ausS', width: '60px', sortable: false },
            ]


          } else {
            // planilla porcentual
          }
          //, tooltip: 'A simple tooltip'  //, hidden: true
        }            


      },
      soloNumeros(e) {
        let key = window.Event ? e.which : e.keyCode
        if (!((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key == 8) || (key == 9) || (key == 37) || (key == 39))) {
            e.preventDefault()
        }
      },
      soloDecimales(e) {
        let key = window.Event ? e.which : e.keyCode
        if (!((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key == 8) || (key == 9) || (key == 37) || (key == 39) || (key == 110) || (key == 189) || (key == 190))) {
            e.preventDefault()
        }
      },
      colorConcepto(c) {
        let colores = ['','','#ee0609']
        return 'color: ' + colores[c]
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
        })
      },
      async ocuparComboPeriodos() {
        this.comboPeriodos = []
        this.$store.state.datosTablas.periodos.forEach(element => {
          this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
        })
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.ocuparComboPlanillas()
      this.ocuparComboPeriodos()
    }
  }
</script>