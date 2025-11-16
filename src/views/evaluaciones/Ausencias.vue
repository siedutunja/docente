<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> REGISTROS DE AUSENCIAS</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="2">
                <b-form-group label="Seleccione el Periodo:" label-for="periodo" class="etiqueta">
                  <b-form-select id="periodo" ref="periodo" v-model="idPeriodo" :options="comboPeriodos" @change="idPlanilla=null,verPlanillaValida=false"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="6">
                <b-form-group label="Seleccione la Planilla:" label-for="asignatura" class="etiqueta">
                  <b-form-select id="asignatura" ref="asignatura" v-model="idPlanilla" :options="comboPlanillas" @change="verPlanillaValida=false" :disabled="idPeriodo!=null ? false : true"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="2">
                <b-form-group label="Fecha:" label-for="fecha" class="etiqueta">
                  <b-form-input id="fecha" ref="fecha" type="date" v-model="fechaSeleccionada" :disabled="idPeriodo!=null && idPlanilla!=null ? false : true"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col lg="2">
                <b-button  style="margin-top: 28px" variant="primary" @click="verPlanilla">Ver Planilla</b-button>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
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
            <b-row v-if="verPlanillaValida">
              <b-col lg="12">
                <b-alert v-if="cambioActivo==true" variant="danger" show><b>Advertencia: </b>La planilla se ha modificado, se recomienda guardar la planilla.</b-alert>
              </b-col>
              <b-col lg="12">
                <div class="planilla-ausencias tabla-scroll">
                  <table ref="tabla">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Estudiante</th>
                        <th></th>
                        <th>Tipo de Ausencia</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(est, rowIndex) in listaEstudiantes" :key="est.idMatricula">
                        <td>{{ rowIndex + 1 }}</td>
                        <td style="text-align: left;">{{ est.estudiante }}</td>
                        <td :class="est.diversa != '' ? 'alert alert-warning' : ''">{{ est.diversa }}</td>
                        <td>
                          <div class="radios">
                            <label v-for="tipo in tiposAusencia" :key="tipo">
                              <input
                                type="radio"
                                :name="`tipo-${rowIndex}`"
                                :value="tipo"
                                v-model="est.tipo"
                              />
                              {{ tipo }}
                            </label>
                          </div>
                        </td>
                        <td>
                          <input
                            :ref="`input-${rowIndex}-cantidad`"
                            v-model.number="est.cantidad"
                            @focus="seleccionarContenido($event)"
                            @blur="validarCantidad(est)"
                            @keydown="navegar(rowIndex, 'cantidad', $event)"
                            type="number"
                            min="0"
                            max="99"
                            @change="cambioActivo = true"
                            :disabled="!est.tipo"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-col>
              <b-col lg="12">
                <b-alert v-if="cambioActivo==true" variant="danger" show><b>Advertencia: </b>La planilla se ha modificado, se recomienda guardar la planilla.</b-alert>
              </b-col>
              <b-col lg="12">
                <b-button class="small mx-1 mt-4 float-right" variant="outline-info" @click="exportarExcel">Exportar a Excel</b-button>
                <b-button class="small mx-1 mt-4 float-right" variant="primary" @click="imprimirPlanilla">Imprimir planilla</b-button>
                <div v-if="!botonGuardando">
                  <b-button class="small mx-1 mt-4" variant="success" @click="botonGuardando=true,guardarAusencias()" :disabled="!cambioActivo">Guardar Planilla</b-button>
                </div>
                <div v-else>
                  <b-button class="small mx-1 mt-4" variant="primary" disabled>
                    <b-spinner small type="grow"></b-spinner>
                    Guardando la planilla...
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </b-card-text>
          <template #footer>
            <em>Ausencias.</em>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import * as XLSX from 'xlsx'

  export default {
    name: 'ausencias',
    components: {
    },
    data () {
      return {
        listaEstudiantes: [],
        idPeriodo: null,
        comboPeriodos: [],
        idPlanilla: null,
        comboPlanillas: [],
        fechaSeleccionada: '',
        btnCargando: false,
        botonGuardando: false,
        cambioActivo: false,
        verPlanillaValida: false,
        tiposAusencia: ['Justificada', 'Sin Justificar', 'Evasiones', 'Retardos'],
        nombreCurso: null,
        nombreSede: null,
        nombrePeriodo: null,
        nombreAsignatura: null,
      }
    },
    methods: {
      seleccionarContenido(e) {
        e.target.select()
      },
      validarCantidad(est) {
        if (typeof est.cantidad !== 'number' || est.cantidad < 0 || est.cantidad > 99) {
          est.cantidad = null
          est.tipo = null
        }
      },
      navegar(row, campo, e) {
        const dir = {
          ArrowUp: row - 1,
          ArrowDown: row + 1
        }[e.key]

        if (dir !== undefined) {
          const ref = `input-${dir}-${campo}`
          this.$refs[ref]?.[0]?.focus()
          e.preventDefault()
        }
      },
      async guardarAusencias() {
        const payload = this.listaEstudiantes.filter(est => typeof est.cantidad === 'number' && est.cantidad > 0).map(est => ({
          idMatricula: est.idMatricula,
          id_asignatura_curso: this.idPlanilla,
          periodo: this.idPeriodo,
          fecha: this.fechaSeleccionada,
          ausJ: est.tipo == 'Justificada' ? est.cantidad : null,
          ausS: est.tipo == 'Sin Justificar' ? est.cantidad : null,
          evasiones: est.tipo == 'Evasiones' ? est.cantidad : null,
          retardos: est.tipo == 'Retardos' ? est.cantidad : null,
          cantidad: est.cantidad ?? null,
          tipo: est.tipo ?? null
        }))
        //console.log(JSON.stringify(payload))
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/ausencias/planilla', JSON.stringify(payload), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Planilla Ausencias')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La planilla de ausencias se ha guardado satisfactoriamente.')
            this.botonGuardando = false
            this.cambioActivo = false
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Planilla Ausencias. Intente más tarde. ' + err)
        })
      },
      imprimirPlanilla() {
        let fecha = 'Fecha: ' + new Date().toLocaleString()
        const clon = this.$refs.tabla.cloneNode(true)
        const inputs = clon.querySelectorAll('input')
        inputs.forEach(input => {
          const valor = input.type === 'radio' ? input.checked ? '●' : '' : input.value || ''
          const span = document.createElement('span')
          span.textContent = valor
          input.parentNode.replaceChild(span, input)
        })
        const estilos = `
          <style>
            body { font-family: Arial; margin: 2px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #999; padding: 2px; text-align: center; }
            thead { background-color: #f0f4fa; position: sticky; top: 0; }
          </style>
        `
        const win = window.open('', '_blank')
        win.document.write(`
          <html><head><title>Planilla de Ausencias</title>${estilos}</head>
          <body onload="window.print();">
          <div style="text-align: center; font-size: 12px;">
            <p>SECRETARÍA DE EDUCACIÓN TERRITORIAL DE TUNJA<br><b>${this.$store.state.nombreInstitucion}</b><br>TUNJA - BOYACÁ<br>REGISTRO DE AUSENCIAS DEL ${this.fechaSeleccionada}<br>
            Sede: ${this.nombreSede} | Curso: ${this.nombreCurso} | Año Lectivo ${this.$store.state.aLectivo} | Periodo: ${this.nombrePeriodo}<br>Asignatura: ${this.nombreAsignatura}</p>
            ${clon.outerHTML}
            <div style="text-align: right; font-size: 12px;"><i>${fecha}</i></div>
          </body></html>
        `)
        win.document.close()
      },
      exportarExcel() {
        const encabezado = [
          ['INSTITUCIÓN EDUCATIVA: ' + this.$store.state.nombreInstitucion],
          ['PLANILLA DE AUSENCIAS: '],
          ['SEDE: ' + this.nombreSede],
          ['CURSO: ' + this.nombreCurso],
          ['AÑO LECTIVO: ' + this.nombreSede],
          ['PERIODO: ' + this.nombrePeriodo],
          ['ASIGNATURA: ' + this.nombreAsignatura],
          ['FECHA: ', this.fechaSeleccionada],
          []
        ]

        const columnas = ['Estudiante', '', 'Cantidad', 'Tipo']
        const datos = this.listaEstudiantes.map(est => [
          est.estudiante,
          est.diversa,
          est.cantidad ?? '',
          est.tipo ?? ''
        ])

        const hoja = XLSX.utils.aoa_to_sheet([...encabezado, columnas, ...datos])
        const libro = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(libro, hoja, 'Ausencias')
        XLSX.writeFile(libro, 'PlanillaAusencias.xlsx')
      },
      async consultaAusenciasEstudiantes() {
        this.listaEstudiantes = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/ausencias/planilla', {params: {idCurso: this.idCurso, idPeriodo: this.idPeriodo, idPlanilla: this.idPlanilla, fecha: this.fechaSeleccionada, vigencia: this.$store.state.aLectivo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Consulta Ausencias')
            this.btnCargando = false
          } else{
            if (response.data.datos != 0) {
              this.listaEstudiantes = response.data.datos
              this.listaEstudiantes.forEach(element => {
                if (element.ausJ != null) {
                  element.cantidad = element.ausJ
                  element.tipo = 'Justificada'
                } else if (element.ausS != null) {
                  element.cantidad = element.ausS
                  element.tipo = 'Sin Justificar'
                } else if (element.evasiones != null) {
                  element.cantidad = element.evasiones
                  element.tipo = 'Evasiones'
                } else if (element.retardos != null) {
                  element.cantidad = element.retardos
                  element.tipo = 'Retardos'
                }
              })
              //console.log(JSON.stringify(this.listaEstudiantes))
              this.btnCargando = false
            } else {
              this.btnCargando = false
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Consulta Ausencias. Intente más tarde.' + err)
          this.btnCargando = false
        })
      },
      verPlanilla() {
        this.btnCargando = true
        this.verPlanillaValida = false
        this.$store.state.listaPlanillasDocente.forEach(element => {
          if (element.idPlanilla == this.idPlanilla) {
            this.idCurso = element.idCurso
            this.nombreCurso = element.nomenclatura
            this.nombreSede = element.sede
            this.nombrePeriodo = document.getElementById('periodo')[document.getElementById('periodo').selectedIndex].text
            this.nombreAsignatura = element.asignatura.toUpperCase()
          }
        })
        const fechaObj = new Date(this.fechaSeleccionada)
        if (fechaObj instanceof Date && !isNaN(fechaObj)) {
          this.verPlanillaValida = true
          this.consultaAusenciasEstudiantes()
        } else {
          this.mensajeEmergente('info',CONFIG.TITULO_MSG,'Lo sentimos, debe seleccionar una fecha válida para consultar o ingresar las ausencias.')
          this.btnCargando = false
        }
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        this.listaPlanillas = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
        })
        //console.log(JSON.stringify(this.$store.state.listaPlanillasDocente))
      },
      async ocuparComboPeriodos() {
        this.comboPeriodos = []
        this.$store.state.periodos.forEach(element => {
          this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
        })
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      const fechaHoy = new Date();
      const formatoYYYYMMDD = fechaHoy.toISOString().split('T')[0];
      this.fechaSeleccionada = formatoYYYYMMDD // new Date().toLocaleString()
      //console.log(this.fechaSeleccionada)
      this.ocuparComboPlanillas()
      this.ocuparComboPeriodos()
    }
  }
</script>

<style scoped>
  .planilla-ausencias {
    font-family: 'Segoe UI', sans-serif;
    margin: 2px;
  }
  .acciones {
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th {
    top: 0;
    background-color: #f0f4fa;
  }
  th, td {
    border: 1px solid #999;
    padding: 3px;
    text-align: center;
  }
  input[type="number"] {
    width: 70px;
    text-align: center;
  }
  .radios {
    display: flex;
    flex-direction: inline;
    gap: 20px;
  }
  .tabla-scroll {
    max-height: auto; /* Ajusta según tu diseño */
    overflow-y: auto;
    border: 1px solid #ccc;
  }
</style>
