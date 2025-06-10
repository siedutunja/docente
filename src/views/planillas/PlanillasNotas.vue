<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> PLANILLAS AUXILIARES CON EVALUACIONES</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="2">
                <b-form-group label="Periodos:" label-for="periodo" class="etiqueta">
                  <b-form-select id="periodo" ref="periodo" v-model="idPeriodo" :options="comboPeriodos"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="idPeriodo!=null">
              <b-col>
                <vue-good-table ref="planillita" :columns="encabColumnas" :rows="listaCursos" styleClass="vgt-table condensed bordered striped" :line-numbers="true" :search-options="{enabled: true,placeholder: 'Filtrar cursos...'}"
                  :select-options="{enabled: true,selectionText: 'cursos seleccionados',clearSelectionText: 'Limpiar',}">
                  <template #selected-row-actions>
                    <button class="small btn btn-primary" @click="imprimirListas()">Imprimir Listas</button>
                  </template>
                  <div slot="emptystate">
                    <h5 class="text-danger ml-5">No existen planillas asignadas</h5>
                  </div>
                </vue-good-table>
              </b-col>
            </b-row>
          </b-card-text>
          <template #footer>
            <em>Seleccione las planillas para imprimir.</em>
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
    name: 'planillasnotas',
    components: {
      VueGoodTable
    },
    data () {
      return {
        idPeriodo: null,
        comboPeriodos: [],
        encabColumnas : [
          { label: 'Curso', field: 'nomenclatura' },
          { label: 'Asignatura', field: 'asignatura', sortable: false },
          { label: 'IH', field: 'ih', sortable: false },
        ],
        listaCursos: [],
        planillasSeleccionadas: [],
      }
    },
    methods: {
      imprimirListas() {
        this.planillasSeleccionadas = []
        //console.log(JSON.stringify(this.$refs.planillita.selectedRows))
        this.$refs.planillita.selectedRows.forEach(element => {
          this.planillasSeleccionadas.push({ 'idAsignaturaCurso': element.idPlanilla, 'id': element.idCurso, 'cu': element.nomenclatura, 'se': element.sede, 'jo': element.jornada, 'di': this.$store.state.Docente, 'as': element.asignatura })
        })
        let docenteTitular = this.$store.state.Docente
        let uri = "?datos=" + JSON.stringify(this.planillasSeleccionadas) + "&ie=" + this.$store.state.nombreInstitucion + "&vigencia=" + this.$store.state.aLectivo + "&escudo=" + this.$store.state.escudoInstitucion + "&titular=" + docenteTitular + "&idPeriodo=" + this.idPeriodo
        let encoded = encodeURI(uri);
        //window.open("http://localhost/siedutunja/php/listas/listas-05.php" + encoded,"_blank")
        window.open("https://siedutunja.gov.co/php/listas/listas-05.php" + encoded,"_blank")
        return true
      },
      async ocuparComboPeriodos() {
        this.comboPeriodos = []
        this.$store.state.datosTablas.periodos.forEach(element => {
          this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
        })
      },
      async consultaListaAsignacion() {
        this.listaCursos = this.$store.state.listaPlanillasDocente
        //console.log(JSON.stringify(this.$store.state.datosCursos))
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.ocuparComboPeriodos()
      this.consultaListaAsignacion()
    }
  }
</script>