<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> ACTIVIDADES ACADÉMICAS</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="3">
                <b-form-group label="Periodo:" label-for="periodo" class="etiqueta">
                  <b-form-select id="periodo" ref="periodo" v-model="idPeriodo" :options="comboPeriodos" @change="idPlanilla=null"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="9">
                <b-form-group label="Seleccione la Planilla:" label-for="asignatura" class="etiqueta">
                  <b-form-select id="asignatura" ref="asignatura" v-model="idPlanilla" :options="comboPlanillas" @change="consultaListaActividades()" :disabled="idPeriodo==null ? true : false"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
            <div v-if="idPlanilla!=null">
              <b-row>
                <b-col lg="12"><b-button class="small float-right mb-2" variant="dark" @click="nuevaActividad()">Nueva Actividad Académica</b-button></b-col>
              </b-row>
              <vue-good-table :columns="encabColumnas" :rows="listaActividades" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'id'">
                    <span style="font-weight: bold; color: blue; cursor: pointer" @click="seleccionarActividad(props.row)" title="Consultar/Actualizar Datos de la Actividad Académica"><CIcon name="cilPencil"/></span>
                  </span>
                </template>
                <div slot="emptystate">
                  <h5 class="text-danger ml-5">No existe Actividades Académicas registradas.</h5>
                </div>
              </vue-good-table>
              <b-button class="small mx-1 mt-2" variant="primary" @click="imprimirActividades()">Imprimir Actividades Académicas</b-button>
              <vue-excel-xlsx class="small mx-1 mt-2 btn btn-outline-primary" :data="listaActividades" :columns="encabColumnasExcel" :file-name="'ActividadesAcademicas-' + new Date().toLocaleDateString()" :file-type="'xlsx'" :sheet-name="'Periodo-' + idPeriodo">
                Exportar Actividades Académicas a Excel
              </vue-excel-xlsx>
            </div>
          </b-card-text>
          <template #footer>
            <em>Actividades Académicas</em>
          </template>
        </b-card>
      </b-col>
    </b-row>
    <b-modal ref="modalCrearEditarActividad" size="xl" scrollable hide-footer :title="datosActividad.editarActividad ? 'Editar Datos de la Actividad' : 'Nueva Actividad'" ok-only>
      <div class="mx-3">
        <div>
          <FichaActividad :datosActividad="datosActividad"  @retorno="datosRecibidosActividad"/>
        </div>
      </div>
    </b-modal>
    <div class="actividades" id="actividades" style="display:none;">
      <table class="table">
        <tbody>
          <tr>
            <td style='width: 7%;'>Docente</td><td style='width: 43%;'>{{$store.state.Docente}}</td>
            <td style='width: 7%;'>Periodo</td><td>{{nombrePeriodo}}</td>
            <td style='width: 7%;'>Fecha</td><td>{{fechaImprimir}}</td>
          </tr>
        </tbody>
      </table>
      <table class="table">
        <thead>
          <tr>
            <th style="text-align: center">Fecha</th>
            <th style="text-align: center">Curso</th>
            <th style="text-align: center">Actividad</th>
            <th style="text-align: center">Evidencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in listaActividades" :key="item.id">
            <td>{{item.fecha}}</td>
            <td>{{item.nomenclatura}}</td>
            <td>{{item.actividades}}</td>
            <td>{{item.evidencias}}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tr>
          <td style="border: hidden">
            <p style="text-align: center;"><br><br>_______________________________________<br>Firma Docente Encargado</p>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import 'vue-good-table/dist/vue-good-table.css'
  import { VueGoodTable } from 'vue-good-table'
  import FichaActividad from '@/views/planillas/FichaActividad'

  export default {
    name: 'actividadesacademicas',
    components: {
      VueGoodTable,
      FichaActividad
    },
    data () {
      return {
        listaActividades: [],
        idPlanilla: null,
        comboPlanillas: [],
        encabColumnas: [
          { label: 'Fecha', field: 'fecha' },
          { label: 'Curso', field: 'nomenclatura' },
          { label: 'Asignatura', field: 'asignatura' },
          { label: 'Per', field: 'periodo' },
          { label: 'Actividad', field: 'actividades' },
          { label: 'Evidencia', field: 'evidencias' },
          { label: '', field: 'id' },
        ],
        encabColumnasExcel: [
          { label: 'Fecha', field: 'fecha' },
          { label: 'Curso', field: 'nomenclatura' },
          { label: 'Asignatura', field: 'asignatura' },
          { label: 'Periodo', field: 'periodo' },
          { label: 'Actividad', field: 'actividades' },
          { label: 'Evidencia', field: 'evidencias' },
        ],
        idPeriodo: null,
        comboPeriodos: [
          { 'value': 1, 'text': 'PRIMERO' },
          { 'value': 2, 'text': 'SEGUNDO' },
          { 'value': 3, 'text': 'TERCERO' },
          { 'value': 4, 'text': 'CUARTO' },
        ],
        nombrePeriodo: null,
        datosActividad: {},
      }
    },
    methods: {
      imprimirActividades() {
        document.getElementById("actividades").style.display = "block";
        // Crear una nueva ventana para imprimir
        const printWindow = window.open("Actividades Académicas", "_blank");

        // Obtener el contenido HTML de la tabla
        const tableHtml = document.querySelector(".actividades").outerHTML;

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
              font-size: 10px;
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
              <title>Actividades Académicas</title>
              ${style}
            </head>
            <body>
              <div style="float: left; margin-top: -1px;">
                <img src="https://siedutunja.gov.co/api/colegios/escudos/${this.$store.state.escudoInstitucion}" style="width:60px;height:60px;"></img>
              </div>
              <div style="margin-left: -60px">
                <p style="text-align: center; font-size: 10px;">SECRETARÍA DE EDUCACIÓN TERRITORIAL DE TUNJA<br><b>${this.$store.state.nombreInstitucion}</b><br>TUNJA -BOYACÁ<br><br><b>ACTIVIDADES ACADÉMICAS - AÑO LECTIVO ${this.$store.state.aLectivo}</p>
              </div>
              ${tableHtml}
            </body>
          </html>
        `);

        // Iniciar la impresión y cerrar la ventana
        //printWindow.document.close();
        //printWindow.print();
        document.getElementById("actividades").style.display = "none";
      },
      nuevaActividad() {
        this.datosActividad.id = null
        this.datosActividad.id_asignatura_curso = this.idPlanilla
        this.datosActividad.fecha = null
        this.datosActividad.actividades = null
        this.datosActividad.evidencias = null
        this.datosActividad.periodo = this.idPeriodo
        this.datosActividad.editarActividad = false
        this.$refs['modalCrearEditarActividad'].show()
      },
      seleccionarActividad(item) {
        this.datosActividad.id = item.id
        this.datosActividad.fecha = item.fecha
        this.datosActividad.actividades = item.actividades
        this.datosActividad.evidencias = item.evidencias
        this.datosActividad.periodo = item.periodo
        this.datosActividad.editarActividad = true
        this.$refs['modalCrearEditarActividad'].show()
      },
      datosRecibidosActividad(retorno) {
        if (retorno == 1) 
          this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La Actividad Académica se ha creado correctamente.')
        else if (retorno == 2)
          this.mensajeEmergente('success',CONFIG.TITULO_MSG,'Los datos de la Actividad Académica se han actualizado correctamente.')
        this.consultaListaActividades()
        this.$refs['modalCrearEditarActividad'].hide()
      },
      async consultaListaActividades() {
        this.nombrePeriodo = document.getElementById('periodo')[document.getElementById('periodo').selectedIndex].text
        this.listaActividades = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/actividadesacademicas', { params: { idPlanilla: this.idPlanilla, idPeriodo: this.idPeriodo }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Lista de Actividades')
          } else{
            if (response.data.datos != 0) {
              this.listaActividades = response.data.datos
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Lista de Actividades. Intente más tarde.' + err)
        })
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
        })
        //console.log(JSON.stringify(this.$store.state.listaPlanillasDocente))
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.ocuparComboPlanillas()
      this.fechaImprimir = new Date().toLocaleString()
    }
  }
</script>