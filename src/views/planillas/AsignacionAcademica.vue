<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> ASIGNACIÓN ACADÉMICA</h5>
          </template>
          <b-card-text>
            <vue-good-table :columns="encabColumnas" :rows="listaAsignacion" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
              <div slot="emptystate">
                <h5 class="text-danger ml-5">No existe Asignación Académica asignada.</h5>
              </div>
            </vue-good-table>
            <b-alert class="text-center" show><h4>IH Total Asignada = {{ totalIH }} horas</h4></b-alert>
          </b-card-text>
          <template #footer>
            <b-button class="small mx-1 mt-2" variant="primary" @click="imprimirAsignacion()">Imprimir Asignación Académica</b-button>
            <vue-excel-xlsx class="small mx-1 mt-2 btn btn-outline-primary" :data="listaAsignacion" :columns="encabColumnas" :file-name="'AsigAcademica-' + new Date().toLocaleDateString()" :file-type="'xlsx'" :sheet-name="'AsigAcademica-' + $store.state.aLectivo">
              Exportar Asignación Académica a Excel
            </vue-excel-xlsx>
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
    name: 'asignacionacademica',
    components: {
      VueGoodTable
    },
    data () {
      return {
        listaAsignacion: [],
        encabColumnas: [
          { label: 'Grado-Curso', field: 'nomenclatura' },
          { label: 'Asignatura', field: 'asignatura' },
          { label: 'IH', field: 'ih' },
          { label: 'Peso', field: 'porcentaje' },
        ],
        totalIH: 0
      }
    },
    methods: {
      imprimirAsignacion() {
        let uri = "?idDocente=" + this.$store.state.idDocente + "&idIE=" + this.$store.state.idInstitucion + "&ie=" + this.$store.state.nombreInstitucion + "&vigencia=" + this.$store.state.aLectivo + "&escudo=" + this.$store.state.escudoInstitucion + "&docente=" + this.$store.state.Docente
        let encoded = encodeURI(uri);
        //window.open("http://localhost/siedutunja/php/docentes/asignacion-docente.php" + encoded,"_blank")
        window.open("https://siedutunja.gov.co/php/docentes/asignacion-docente.php" + encoded,"_blank")
        return true
      },
      async consultaListaAsignacion() {
        this.listaAsignacion = this.$store.state.listaPlanillasDocente
        this.totalIH = 0
        this.listaAsignacion.forEach(element => {
          this.totalIH += element.ih
        })
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.consultaListaAsignacion()
    }
  }
</script>