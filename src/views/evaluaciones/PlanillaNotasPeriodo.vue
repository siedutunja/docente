<template>
  <div>
    <b-row>
      <b-col lg="12">
        <div v-if="btnCargando">
          <div class="text-center m-5 text-primary">
            <b-spinner style="width: 3rem; height: 3rem;" label="Spinner"></b-spinner>
            <br><strong>Cargando datos...</strong>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="!btnCargando && idAsignaturaCurso!=null">
      <b-col lg="12">
        <b-button class="float-right mb-2 ml-2" variant="info" style="width: 150px" @click="recalcularPlanilla()" >Recalcular<br>Planilla</b-button>
        <b-button class="float-right mb-2 ml-2" variant="info" style="width: 150px" @click="seleccionarColumnaPegarExcel()" >Pegar valoraciones<br>desde Excel</b-button>
      </b-col>
      <b-col lg="12">
        <b-alert v-if="cambioActivo==true" variant="danger" show><b>Advertencia: </b>La planilla se ha modificado, se recomienda guardar la planilla.</b-alert>
      </b-col>
      <b-col lg="12">
        <div class="editor-notas tabla-scroll" ref="planillaEditable">
          <table>
            <thead>
              <tr>
                <th rowspan="2" style="background: #F2ECEB">#</th>
                <th rowspan="2" style="background: #F2ECEB">Estudiante</th>
                <th rowspan="2" style="background: #F2ECEB"></th>
                <template v-for="(config, criterio) in criteriosEvaluacion">
                  <th :key="criterio" :colspan="config.cantidadNotas + 1">{{ config.nombreCriterio }} - {{ config.porcentaje }}%</th>
                </template>
                <th rowspan="2">Definitiva</th>
                <th rowspan="2">Concepto</th>
                <th rowspan="2" style="background: #F2ECEB">#</th>
                <th rowspan="2">AusJ</th>
                <th rowspan="2">AusS</th>
              </tr>
              <tr>
                <template v-for="(config, criterio) in criteriosEvaluacion">
                  <template v-for="(campo, i) in config.camposNotas.slice(0, config.cantidadNotas)">
                    <th :key="campo" :title="config.encabezadosNotas[i] || config.camposNotas[i]">{{ config.tipoCalculo == 1 ? config.porcentajesNotas[i] + '%' : 'EQ' }}</th>
                  </template>
                  <th :key="criterio" style="background: #F2ECEB">Subtotal</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(est, rowIndex) in listaEstudiantes" :key="est.idMatricula">
                <td style="background: #F2ECEB">{{ rowIndex + 1 }}</td>
                <td style="text-align: left; background: #F2ECEB">{{ est.estudiante }}</td>
                <td style="background: #F2ECEB" :class="est.diversa != '' ? 'alert alert-warning' : ''">{{ est.diversa }}</td>
                <template v-for="(config, criterio) in criteriosEvaluacion">
                  <template v-for="(campo, colIndex) in config.camposNotas.slice(0, config.cantidadNotas)">
                    <td :key="campo">
                      <input
                        :ref="`input-${rowIndex}-${criterio}-${colIndex}`"
                        v-model.number="est[campo]"
                        @keydown="navegar(rowIndex, criterio, colIndex, $event),soloDecimales($event)"
                        @input="calcular(est)"
                        type=""
                        step="0.1"
                        min="1"
                        max="5"
                        maxlength="3"
                        @blur="validarNota(est, campo)"
                        @focus="seleccionarContenido($event)"
                        @change="cambioActivo = true"
                        :class="{ invalido: est[campo] < 1 || est[campo] > 5 }"
                      />
                    </td>
                  </template>
                  <td :key="criterio" style="background: #F2ECEB"><strong>{{ est[`def${criterio}`] > 0 ? est[`def${criterio}`].toFixed(1) : '-' }}</strong></td>
                </template>
                <td :class="`concepto-${conceptoValorativo(est.definitiva)}`"><strong>{{ est.definitiva > 0 ? est.definitiva : '-' }}</strong></td>
                <td :class="`concepto-texto-${conceptoValorativo(est.definitiva)}`"><strong>{{ conceptoValorativo(est.definitiva) }}</strong></td>
                <td style="background: #F2ECEB">{{ rowIndex + 1 }}</td>
                <td>
                  <input
                    :ref="`input-${rowIndex}-ausJ`"
                    v-model.number="est.ausJ"
                    @focus="seleccionarContenido($event)"
                    @blur="validarAusencia(est, 'ausJ')"
                    @keydown="navegarAusencia(rowIndex, 'ausJ', $event),soloNumeros($event)"
                    @change="cambioActivo = true"
                    maxlength="2"
                  />
                </td>
                <td>
                  <input
                    :ref="`input-${rowIndex}-ausS`"
                    v-model.number="est.ausS"
                    @focus="seleccionarContenido($event)"
                    @blur="validarAusencia(est, 'ausS')"
                    @keydown="navegarAusencia(rowIndex, 'ausS', $event),soloNumeros($event)"
                    @change="cambioActivo = true"
                    maxlength="2"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>
      <b-col lg="12">
        <div v-if="configuracionPlanilla.id_tipo == 2">
          <h6>Conceptos Valorativos:
            <span class="ml-3 text-danger">BAJO: ({{Number(configuracionPlanilla.minBajT).toFixed(1)}} a {{Number(configuracionPlanilla.maxBajT).toFixed(1)}})</span>
            <span class="ml-3 text-primary">BÁSICO: ({{Number(configuracionPlanilla.minBasT).toFixed(1)}} a {{Number(configuracionPlanilla.maxBasT).toFixed(1)}})</span>
            <span class="ml-3 text-warning">ALTO: ({{Number(configuracionPlanilla.minAltT).toFixed(1)}} a {{Number(configuracionPlanilla.maxAltT).toFixed(1)}})</span>
            <span class="ml-3 text-success">SUPERIOR: ({{Number(configuracionPlanilla.minSupT).toFixed(1)}} a {{Number(configuracionPlanilla.maxSupT).toFixed(1)}})</span>
          </h6>
        </div>
        <div v-else-if="configuracionPlanilla.id_tipo == 1">
          <h6>Conceptos Valorativos: 
            <span class="ml-3 text-danger">BAJO: ({{Number(configuracionPlanilla.minBaj).toFixed(1)}} a {{Number(configuracionPlanilla.maxBaj).toFixed(1)}})</span>
            <span class="ml-3 text-primary">BÁSICO: ({{Number(configuracionPlanilla.minBas).toFixed(1)}} a {{Number(configuracionPlanilla.maxBas).toFixed(1)}})</span>
            <span class="ml-3 text-warning">ALTO: ({{Number(configuracionPlanilla.minAlt).toFixed(1)}} a {{Number(configuracionPlanilla.maxAlt).toFixed(1)}})</span>
            <span class="ml-3 text-success">SUPERIOR: ({{Number(configuracionPlanilla.minSup).toFixed(1)}} a {{Number(configuracionPlanilla.maxSup).toFixed(1)}})</span>
          </h6>
        </div>
        <div v-else>
          <h6>Conceptos Valorativos: SIN DEFINIR</h6>
        </div>
      </b-col>
      <b-col lg="12">
        <b-alert v-if="cambioActivo==true" variant="danger" show><b>Advertencia: </b>La planilla se ha modificado, se recomienda guardar la planilla.</b-alert>
      </b-col>
      <b-col lg="12">
        <b-button class="small mx-1 mt-4 float-right" variant="outline-info" @click="exportarExcel">Exportar a Excel</b-button>
        <b-button class="small mx-1 mt-4 float-right" variant="primary" @click="imprimirPlanilla">Imprimir planilla</b-button>
        <div v-if="!botonGuardando">
          <b-button class="small mx-1 mt-4" variant="success" @click="botonGuardando=true,guardarPlanilla()" :disabled="!cambioActivo">Guardar Planilla Parcial</b-button>
        </div>
        <div v-else>
          <b-button class="small mx-1 mt-4" variant="primary" disabled>
            <b-spinner small type="grow"></b-spinner>
            Guardando la planilla...
          </b-button>
        </div>
      </b-col>
      <b-col lg="12"><br><hr><br></b-col>
      <b-col lg="4">
        <div class="tabla-consolidado">
          <h3>Consolidado por Desempeño</h3>
          <table>
            <thead>
              <tr>
                <th>Nivel</th>
                <th>Cantidad</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cantidad, nivel) in consolidadoDesempeño.conteo" :key="nivel" :class="`nivel-${nivel}`">
                <td style="text-align: left;">Estudiantes en {{ nivel }}</td>
                <td>{{ cantidad }}</td>
                <td>{{ consolidadoDesempeño.porcentajes[nivel] }}%</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"><strong>Promedio del curso</strong></td>
                <td><strong>{{ consolidadoDesempeño.promedioCurso }}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </b-col>
      <b-col>
        <CChartDoughnut :datasets="defaultDatasets" :labels="['BAJO', 'BASICO', 'ALTO', 'SUPERIOR', 'SIN NOTA']" />
      </b-col>
    </b-row>


    <b-modal ref="modalSeleccionarColumna" size="" scrollable hide-footer title="Seleccionar Columna" ok-only>
      <div class="mx-3">
        <div>
          <b-row>
            <b-col lg="12">
              <p>Esta opción le permite copiar datos de una hoja de Excel y pegarlos en la columna que usted seleccione.</p>
              <p>Tenga en cuenta las siguientes condiciones:</p>
              <ul>
                <li>Los datos se deben copiar desde el portapapeles del sistema. Generalmente se copian con la combianción de teclas (Ctrl+C).</li>
                <li>Los datos se pegaran en la columna que seleccione.</li>
                <li>Los datos se pegaran desde la primera fila de la columna seleccionada.</li>
                <li>Los datos que no sean numéricos no se pegan.</li>
                <li>Los datos que no cumplan los criterios de validación no se pegan.</li>
              </ul>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12">
              <b-form-group label="Seleccionar Columna Destino*" label-for="columna" class="etiqueta">
                <b-form-select  id="columna" ref="columna" v-model="idColumnaCopiar">
                  <option v-for="col in columnasDisponibles" :key="col.campo" :value="col.campo">{{ col.encabezado }} ({{ col.campo }})</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col lg="12" md="12"><hr></b-col>
            <b-col lg="12" md="12" v-if="idColumnaCopiar != null">
              <b-button class="small mt-1 mr-3" variant="primary" @click="procesarPegado()">Pegar Valoraciones</b-button>
              <b-button class="small mt-1 mr-3" variant="secondary" @click="cancelarVentana">Cancelar</b-button>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import * as XLSX from 'xlsx'
  import { CChartDoughnut } from '@coreui/vue-chartjs'

  export default {
    name: 'planillanotasperiodo',
    props: {
      configuracionPlanilla: Object
    },
    components: {
      CChartDoughnut,
    },
    data () {
      return {
        periodoActual: null,
        encabezados: {},
        listaEstudiantes: [],
        criteriosEvaluacion: {},
        btnCargando: false,
        cambioActivo: false,
        botonGuardando: false,
        idColumnaCopiar: null,
        comboColumnas: [],
        totalBaj: 0,
        totalBas: 0,
        totalAlt: 0,
        totalSup: 0,
        totalSin: 0,
      }
    },
    methods: {
      async guardarPlanilla() {
        const payload = this.listaEstudiantes.map(est => {
          const registro = {
            idMatricula: est.idMatricula,
            id_asignatura_curso: this.configuracionPlanilla.idPlanilla,
            periodo: this.configuracionPlanilla.idPeriodo,
            ausJ: est.ausJ ?? null,
            ausS: est.ausS ?? null,
            definitiva: est.definitiva ?? null,
            concepto: this.conceptoValorativo(est.definitiva)
          }
          Object.entries(this.criteriosEvaluacion).forEach(([criterio, config]) => {
            // Notas individuales
            config.camposNotas.slice(0, config.cantidadNotas).forEach(campo => {
              registro[campo] = est[campo] ?? null
            })
            // Subtotal del criterio
            registro[`def${criterio}`] = est[`def${criterio}`] ?? null
          })
          return registro
        })
        //console.log(JSON.stringify(payload))
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/notas/planilla', JSON.stringify(payload), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Planilla')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La planilla parcial de evaluaciones se ha guardado satisfactoriamente.')
            this.botonGuardando = false
            this.cambioActivo = false
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Planilla. Intente más tarde. ' + err)
        })
      },
      async procesarPegado() {
        try {
          // Obtener datos del portapapeles
          const clipboardData = await navigator.clipboard.readText();
          // Dividir los datos por líneas y columnas
          const rowsFromClipboard = clipboardData.split("\n");
          //console.log(rowsFromClipboard)
          rowsFromClipboard.forEach((row, index) => {
            row = row.substr(0,3) //substring(0,3)
            row = row.replace(/,/g, '.')
            if (this.configuracionPlanilla.id_tipo == 1) {
              if (isNaN(row) || row < this.configuracionPlanilla.minBaj || row > this.configuracionPlanilla.maxSup) {
                row = ''
              }
            } else if (this.configuracionPlanilla.id_tipo == 2) {
              if (isNaN(row) || row < this.configuracionPlanilla.minBajT || row > this.configuracionPlanilla.maxSupT) {
                row = ''
              }
            } else {
              row = ''
            }
            const values = row.split("\t") // Separación por tabulaciones
            if (this.listaEstudiantes[index]) {
              this.$set(this.listaEstudiantes[index], this.idColumnaCopiar, Number(values[0]) > 0 ? Number(values[0]) : null)
              this.calcular(this.listaEstudiantes[index])
            }
          })
          this.cambioActivo = true
          this.cancelarVentana()
        } catch (error) {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'No es posible pegar los datos. Intente nuevamente seleccionar y copiar los datos desde Excel.')
        }
      },
      validarNota(est, campo) {
        const nota = est[campo]
        if ((typeof nota === 'number' && (nota < 1 || nota > 5)) || typeof nota === 'string') {
          est[campo] = null
          this.calcular(est)
        }
      },
      calcular(est) {
        let definitiva = 0
        Object.entries(this.criteriosEvaluacion).forEach(([criterio, config]) => {
          const campos = config.camposNotas.slice(0, config.cantidadNotas)
          const notas = campos.map(c => est[c]).filter(n => typeof n === 'number')
          let subtotal = 0
          if (config.tipoCalculo === 0) {
            const suma = notas.reduce((a, b) => a + b, 0)
            subtotal = notas.length ? suma / notas.length : 0
          } else {
            subtotal = notas.reduce((acc, nota, i) => {
              const peso = config.porcentajesNotas[i] || 0
              return acc + nota * peso
            }, 0) / 100
          }
          est[`def${criterio}`] = this.redondear(subtotal)
          definitiva += this.redondear(subtotal) * (config.porcentaje / 100)
        })
        est.definitiva = this.redondear(definitiva)
      },
      conceptoValorativo(nota) {
        if (this.configuracionPlanilla.id_tipo == 1) {
          if (nota >= this.configuracionPlanilla.minBaj && nota < this.configuracionPlanilla.minBas) {
            return 'BAJO'
          } else if (nota >= this.configuracionPlanilla.minBas && nota < this.configuracionPlanilla.minAlt) {
            return 'BASICO'
          } else if (nota >= this.configuracionPlanilla.minAlt && nota < this.configuracionPlanilla.minSup) {
            return 'ALTO'
          } else if (nota >= this.configuracionPlanilla.minSup && nota <= this.configuracionPlanilla.maxSup) {
            return 'SUPERIOR'
          } else {
            return null
          }
        } else if (this.configuracionPlanilla.id_tipo == 2) {
          if (nota >= this.configuracionPlanilla.minBajT && nota < this.configuracionPlanilla.minBasT) {
            return 'BAJO'
          } else if (nota >= this.configuracionPlanilla.minBasT && nota < this.configuracionPlanilla.minAltT) {
            return 'BASICO'
          } else if (nota >= this.configuracionPlanilla.minAltT && nota < this.configuracionPlanilla.minSupT) {
            return 'ALTO'
          } else if (nota >= this.configuracionPlanilla.minSupT && nota <= this.configuracionPlanilla.maxSupT) {
            return 'SUPERIOR'
          } else {
            return null
          }
        }
      },
      validarAusencia(est, campo) {
        const val = est[campo]
        if (val < 1 || val > 99) est[campo] = null
      },
      navegar(row, criterio, col, e) {
        const dir = {
          ArrowRight: [row, criterio, col + 1],
          ArrowLeft: [row, criterio, col - 1],
          ArrowUp: [row - 1, criterio, col],
          ArrowDown: [row + 1, criterio, col]
        }[e.key]
        if (dir) {
          const ref = `input-${dir[0]}-${dir[1]}-${dir[2]}`
          this.$refs[ref]?.[0]?.focus()
          e.preventDefault()
        }
      },
      navegarAusencia(row, campo, e) {
        const dir = {
          ArrowUp: [row - 1, campo],
          ArrowDown: [row + 1, campo],
          ArrowLeft: [row, campo === 'ausS' ? 'ausJ' : null],
          ArrowRight: [row, campo === 'ausJ' ? 'ausS' : null]
        }[e.key]

        if (dir && dir[1]) {
          const ref = `input-${dir[0]}-${dir[1]}`
          this.$refs[ref]?.[0]?.focus()
          e.preventDefault()
        }
      },
      async consultaNotasEstudiantes() {
        this.listaEstudiantes = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/notas/planilla', {params: {idCurso: this.configuracionPlanilla.idCurso, idPeriodo: this.configuracionPlanilla.idPeriodo, idPlanilla: this.configuracionPlanilla.idPlanilla, idTipoEsp: this.configuracionPlanilla.id_tipo, idEspecialidad: this.configuracionPlanilla.id_especialidad}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Consulta Lista Curso')
            this.btnCargando = false
          } else{
            if (response.data.datos != 0) {
              this.listaEstudiantes = response.data.datos
              //console.log(JSON.stringify(this.listaEstudiantes))
              this.btnCargando = false
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Consulta Lista Curso. Intente más tarde.' + err)
          this.btnCargando = false
        })
      },
      cargarConfiguracionCriterios() {
        this.criteriosEvaluacion = {}
        if (this.configuracionPlanilla.estadoC1 == 1) {
          this.criteriosEvaluacion.C1 = {
            nombreCriterio: this.configuracionPlanilla.nombreC1,
            cantidadNotas: this.encabezados.numNotasC1,
            tipoCalculo: this.encabezados.val01, // 1 = promedio, 2 = ponderado
            porcentaje: this.configuracionPlanilla.porcentajeC1,
            encabezadosNotas: [this.encabezados.enc01,this.encabezados.enc02,this.encabezados.enc03,this.encabezados.enc04,this.encabezados.enc05,this.encabezados.enc16,this.encabezados.enc17,this.encabezados.enc18,this.encabezados.enc19,this.encabezados.enc20],
            porcentajesNotas: [this.encabezados.por01,this.encabezados.por02,this.encabezados.por03,this.encabezados.por04,this.encabezados.por05,this.encabezados.por16,this.encabezados.por17,this.encabezados.por18,this.encabezados.por19,this.encabezados.por20], // solo si tipoCalculo = 2
            camposNotas: ['n1C1','n2C1','n3C1','n4C1','n5C1','n6C1','n7C1','n8C1','n9C1','n10C1']
          }
        }
        if (this.configuracionPlanilla.estadoC2 == 1) {
          this.criteriosEvaluacion.C2 = {
            nombreCriterio: this.configuracionPlanilla.nombreC2,
            cantidadNotas: this.encabezados.numNotasC2,
            tipoCalculo: this.encabezados.val02, // 1 = promedio, 2 = ponderado
            porcentaje: this.configuracionPlanilla.porcentajeC2,
            encabezadosNotas: [this.encabezados.enc06,this.encabezados.enc07,this.encabezados.enc08,this.encabezados.enc09,this.encabezados.enc10,this.encabezados.enc21,this.encabezados.enc22,this.encabezados.enc23,this.encabezados.enc24,this.encabezados.enc25],
            porcentajesNotas: [this.encabezados.por06,this.encabezados.por07,this.encabezados.por08,this.encabezados.por09,this.encabezados.por10,this.encabezados.por21,this.encabezados.por22,this.encabezados.por23,this.encabezados.por24,this.encabezados.por25], // solo si tipoCalculo = 2
            camposNotas: ['n1C2','n2C2','n3C2','n4C2','n5C2','n6C2','n7C2','n8C2','n9C2','n10C2']
          }
        }
        if (this.configuracionPlanilla.estadoC3 == 1) {
          this.criteriosEvaluacion.C3 = {
            nombreCriterio: this.configuracionPlanilla.nombreC3,
            cantidadNotas: this.encabezados.numNotasC3,
            tipoCalculo: this.encabezados.val03, // 1 = promedio, 2 = ponderado
            porcentaje: this.configuracionPlanilla.porcentajeC3,
            encabezadosNotas: [this.encabezados.enc11,this.encabezados.enc12,this.encabezados.enc13,this.encabezados.enc14,this.encabezados.enc15,this.encabezados.enc26,this.encabezados.enc27,this.encabezados.enc28,this.encabezados.enc29,this.encabezados.enc30],
            porcentajesNotas: [this.encabezados.por11,this.encabezados.por12,this.encabezados.por13,this.encabezados.por14,this.encabezados.por15,this.encabezados.por26,this.encabezados.por27,this.encabezados.por28,this.encabezados.por29,this.encabezados.por30], // solo si tipoCalculo = 2
            camposNotas: ['n1C3','n2C3','n3C3','n4C3','n5C3','n6C3','n7C3','n8C3','n9C3','n10C3']
          }
        }
        /*
        this.criteriosEvaluacion = {
          C1: {
            nombreCriterio: this.configuracionPlanilla.nombreC1,
            cantidadNotas: this.encabezados.numNotasC1,
            tipoCalculo: this.encabezados.val01, // 1 = promedio, 2 = ponderado
            porcentaje: this.configuracionPlanilla.porcentajeC1,
            encabezadosNotas: [this.encabezados.enc01,this.encabezados.enc02,this.encabezados.enc03,this.encabezados.enc04,this.encabezados.enc05,this.encabezados.enc16,this.encabezados.enc17,this.encabezados.enc18,this.encabezados.enc19,this.encabezados.enc20],
            porcentajesNotas: [this.encabezados.por01,this.encabezados.por02,this.encabezados.por03,this.encabezados.por04,this.encabezados.por05,this.encabezados.por16,this.encabezados.por17,this.encabezados.por18,this.encabezados.por19,this.encabezados.por20], // solo si tipoCalculo = 2
            camposNotas: ['n1C1','n2C1','n3C1','n4C1','n5C1','n6C1','n7C1','n8C1','n9C1','n10C1']
          },
          C2: {
            nombreCriterio: this.configuracionPlanilla.nombreC2,
            cantidadNotas: this.encabezados.numNotasC2,
            tipoCalculo: this.encabezados.val02, // 1 = promedio, 2 = ponderado
            porcentaje: this.configuracionPlanilla.porcentajeC2,
            encabezadosNotas: [this.encabezados.enc06,this.encabezados.enc07,this.encabezados.enc08,this.encabezados.enc09,this.encabezados.enc10,this.encabezados.enc21,this.encabezados.enc22,this.encabezados.enc23,this.encabezados.enc24,this.encabezados.enc25],
            porcentajesNotas: [this.encabezados.por06,this.encabezados.por07,this.encabezados.por08,this.encabezados.por09,this.encabezados.por10,this.encabezados.por21,this.encabezados.por22,this.encabezados.por23,this.encabezados.por24,this.encabezados.por25], // solo si tipoCalculo = 2
            camposNotas: ['n1C2','n2C2','n3C2','n4C2','n5C2','n6C2','n7C2','n8C2','n9C2','n10C2']
          },
          C3: {
            nombreCriterio: this.configuracionPlanilla.nombreC3,
            cantidadNotas: this.encabezados.numNotasC3,
            tipoCalculo: this.encabezados.val03, // 1 = promedio, 2 = ponderado
            porcentaje: this.configuracionPlanilla.porcentajeC3,
            encabezadosNotas: [this.encabezados.enc11,this.encabezados.enc12,this.encabezados.enc13,this.encabezados.enc14,this.encabezados.enc15,this.encabezados.enc26,this.encabezados.enc27,this.encabezados.enc28,this.encabezados.enc29,this.encabezados.enc30],
            porcentajesNotas: [this.encabezados.por11,this.encabezados.por12,this.encabezados.por13,this.encabezados.por14,this.encabezados.por15,this.encabezados.por26,this.encabezados.por27,this.encabezados.por28,this.encabezados.por29,this.encabezados.por30], // solo si tipoCalculo = 2
            camposNotas: ['n1C3','n2C3','n3C3','n4C3','n5C3','n6C3','n7C3','n8C3','n9C3','n10C3']
          }
        }
        */
        //console.log(JSON.stringify(this.criteriosEvaluacion))
        this.consultaNotasEstudiantes()
      },
      async cargarEncabezados() {
        this.btnCargando = true
        this.encabezados = {}
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/configuracion/planilla', {params: {idPlanilla: this.configuracionPlanilla.idPlanilla, idPeriodo: this.configuracionPlanilla.idPeriodo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Encabezados Planilla')
            this.btnCargando = false
          } else{
            if (response.data.datos != 0) {
              this.encabezados = response.data.datos
              this.cargarConfiguracionCriterios()
            }
          }
          //console.log(JSON.stringify(this.encabezados))
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Encabezados Planilla. Intente más tarde.' + err)
          this.btnCargando = false
        })
      },
      exportarExcel() {
        const encabezado = [
          ['I.E.:', this.$store.state.nombreInstitucion],
          ['PLANILLA:', this.configuracionPlanilla.asignatura],
          ['PERIODO:', this.periodoActual],
          ['FECHA:', new Date().toLocaleDateString()],
          []
        ]
        const columnas = ['Estudiante']
        Object.entries(this.criteriosEvaluacion).forEach(([criterio, config]) => {
          columnas.push(...config.encabezadosNotas.slice(0, config.cantidadNotas))
          columnas.push(`Subtotal ${criterio}`)
        })
        columnas.push('Definitiva', 'Concepto', 'AusJ', 'AusS')
        const datos = this.listaEstudiantes.map(est => {
          const fila = [est.estudiante]
          Object.entries(this.criteriosEvaluacion).forEach(([criterio, config]) => {
            const notas = config.camposNotas.slice(0, config.cantidadNotas).map(campo => est[campo] ?? '')
            fila.push(...notas)
            fila.push(est[`def${criterio}`] > 0 ? est[`def${criterio}`].toFixed(1) : '')
          })
          fila.push(est.definitiva > 0 ? est.definitiva.toFixed(1) : '')
          fila.push(this.conceptoValorativo(est.definitiva))
          fila.push(est.ausJ ?? '')
          fila.push(est.ausS ?? '')
          return fila
        })
        const hoja = XLSX.utils.aoa_to_sheet([...encabezado, columnas, ...datos])
        const libro = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(libro, hoja, 'Notas Parciales')
        XLSX.writeFile(libro, 'Notas-' + this.configuracionPlanilla.asignatura + '.xlsx')
      },
      imprimirPlanilla() {
        let fecha = 'Fecha: ' + new Date().toLocaleString()
        let tituloInforme = 'PLANILLA DE EVALUACIÓN PARCIAL POR PERIODO'
        const original = this.$refs.planillaEditable
        if (!original) return

        // Clonar la tabla y convertir inputs en texto
        const clon = original.cloneNode(true)
        const inputs = clon.querySelectorAll('input')

        inputs.forEach(input => {
          const valor = input.value || '–'
          const span = document.createElement('span')
          span.textContent = valor
          span.style.padding = '6px'
          span.style.display = 'inline-block'
          span.style.minWidth = input.offsetWidth + 'px'
          input.parentNode.replaceChild(span, input)
        })
        const estilos = `
          <style>
            @media print {
              body {
                font-family: 'Segoe UI', sans-serif;
                margin: 2px;
              }
              h2 {
                text-align: center;
                margin-bottom: 2px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 10px;
              }
              th, td {
                border: 1px solid #999;
                padding: 1px;
                text-align: center;
              }
              thead {
                background-color: #f0f4fa;
              }
            }
          </style>
        `
        const ventana = window.open('Notas Parciales', '_blank')
        ventana.document.write(`
          <html>
            <head>
              <title>Planilla de Notas Parciales</title>
              ${estilos}
            </head>
            <body>
              <p style="text-align: center; font-size: 12px;">SECRETARÍA DE EDUCACIÓN TERRITORIAL DE TUNJA<br><b>${this.$store.state.nombreInstitucion}</b><br>TUNJA - BOYACÁ<br>${tituloInforme}<br>Planilla: ${this.configuracionPlanilla.asignatura} | Año Lectivo ${this.$store.state.aLectivo} | Periodo: ${this.periodoActual}</p>
              ${clon.innerHTML}
              <div style="text-align: right; font-size: 12px;"><i>${fecha}</i></div>
            </body>
          </html>
        `)
        ventana.document.close()
      },
      seleccionarContenido(event) {
        event.target.select()
      },
      recalcularPlanilla() {
        this.listaEstudiantes.forEach(est => {
          this.calcular(est)
        })
        this.cambioActivo = true
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
      redondear(num) {
        var m = Number((Math.abs(num) * 10).toPrecision(15))
        return Math.round(m) / 10 * Math.sign(num);
      },
      seleccionarColumnaPegarExcel() {
        this.idColumnaCopiar = null
        this.$refs['modalSeleccionarColumna'].show()
      },
      cancelarVentana() {
        this.idColumnaCopiar = null
        this.$refs['modalSeleccionarColumna'].hide()
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    computed: {
      columnasDisponibles() {
        const columnas = []
        Object.entries(this.criteriosEvaluacion).forEach(([criterio, config]) => {
          config.camposNotas.slice(0, config.cantidadNotas).forEach((campo, i) => {
            columnas.push({
              campo,
              encabezado: config.encabezadosNotas[i] || campo
            })
          })
        })
        return columnas
      },
      consolidadoDesempeño() {
        const conteo = {
          BAJO: 0,
          BASICO: 0,
          ALTO: 0,
          SUPERIOR: 0,
          'SIN NOTA': 0
        }
        let suma = 0
        let totalConNota = 0

        this.listaEstudiantes.forEach(est => {
          const nota = est.definitiva
          if (typeof nota == 'string' || nota < 1 || nota == null) {
            conteo['SIN NOTA']++
            this.totalSin++
            return
          }
          suma += nota
          totalConNota++
          if (this.configuracionPlanilla.id_tipo == 1) {
            if (nota >= this.configuracionPlanilla.minBaj && nota < this.configuracionPlanilla.minBas) {
              conteo.BAJO++
              this.totalBaj++
            } else if (nota >= this.configuracionPlanilla.minBas && nota < this.configuracionPlanilla.minAlt) {
              conteo.BASICO++
              this.totalBas++
            } else if (nota >= this.configuracionPlanilla.minAlt && nota < this.configuracionPlanilla.minSup) {
              conteo.ALTO++
              this.totalAlt++
            } else if (nota >= this.configuracionPlanilla.minSup && nota <= this.configuracionPlanilla.maxSup) {
              conteo.SUPERIOR++
              this.totalSup++
            }
          } else if (this.configuracionPlanilla.id_tipo == 2) {
            if (nota >= this.configuracionPlanilla.minBajT && nota < this.configuracionPlanilla.minBasT) {
              conteo.BAJO++
              this.totalBaj++
            } else if (nota >= this.configuracionPlanilla.minBasT && nota < this.configuracionPlanilla.minAltT) {
              conteo.BASICO++
              this.totalBas++
            } else if (nota >= this.configuracionPlanilla.minAltT && nota < this.configuracionPlanilla.minSupT) {
              conteo.ALTO++
              this.totalAlt++
            } else if (nota >= this.configuracionPlanilla.minSupT && nota <= this.configuracionPlanilla.maxSupT) {
              conteo.SUPERIOR++
              this.totalSup++
            }
          }
        })
        const total = this.listaEstudiantes.length
        const porcentajes = Object.fromEntries(
          Object.entries(conteo).map(([nivel, cantidad]) => [
            nivel,
            total ? ((cantidad / total) * 100).toFixed(1) : '0.0'
          ])
        )
        const promedioCurso = totalConNota ? (suma / totalConNota).toFixed(3) : '-'
        return { conteo, porcentajes, promedioCurso }
      },
      defaultDatasets () {
        return [
          {
            backgroundColor: ['#f8d7da','#d1ecf1','#fff3cd','#d4edda','#e2e3e5'],
            data: [this.totalBaj, this.totalBas, this.totalAlt, this.totalSup, this.totalSin]
          }
        ]
      }
    },
    beforeMount() {
      this.idAsignaturaCurso = this.configuracionPlanilla.idPlanilla
      this.periodoActual = this.configuracionPlanilla.idPeriodo
      this.cargarEncabezados()
    },
  }
</script>
<style scoped>
  .editor-notas {
    font-family: 'Segoe UI', sans-serif;
    margin: 2px;
  }
  .tabla-scroll {
    max-height: 600px; /* Ajusta según tu diseño */
    overflow-y: auto;
    border: 1px solid #ccc;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  thead {
    border: 2px solid #ccc;
    padding: 3px;
    text-align: center;
    position: sticky;
    top: 0;
    background-color: #f9f9f9;
    z-index: 10;
    border-bottom: 2px solid #999;
  }
  th {
    border: 2px solid #ccc;
    padding: 3px;
    text-align: center;
  }
  td {
    border: 1px solid #ccc;
    padding: 3px;
    text-align: center;
  }
  input {
    width: 50px;
    text-align: center;
  }
  .invalido {
    border-color: #E6BDFA;
    background-color: #F6E7FD;
  }
  .concepto-BAJO {
    background-color: #f8d7da; /* rojo claro */
    color: #721c24;
  }
  .concepto-BASICO {
    background-color: #d1ecf1; /* azul claro */
    color: #0c5460;
  }
  .concepto-ALTO {
    background-color: #fff3cd; /* amarillo claro */
    color: #856404;
  }
  .concepto-SUPERIOR {
    background-color: #d4edda; /* verde claro */
    color: #155724;
  }
  .concepto-texto-BAJO { color: #c82333; }
  .concepto-texto-BASICO { color: #17a2b8; }
  .concepto-texto-ALTO { color: #e0a800; }
  .concepto-texto-SUPERIOR { color: #28a745; }

  .nivel-BAJO td { background-color: #f8d7da; color: #721c24; }
  .nivel-BASICO td { background-color: #d1ecf1; color: #0c5460; }
  .nivel-ALTO td { background-color: #fff3cd; color: #856404; }
  .nivel-SUPERIOR td { background-color: #d4edda; color: #155724; }
  .nivel-SIN\ NOTA td { background-color: #e2e3e5; color: #6c757d; }

</style>
