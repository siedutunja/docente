<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> DATOS DE LA ACTIVIDAD ACADÉMICA</h5>
          </template>
          <b-card-text>
            <b-row>
              <b-col lg="3">
                <b-form-group label="Fecha Actividad:*" label-for="fecha" class="etiqueta">
                  <b-form-input type="date" id="fecha" ref="fecha" v-model="$v.infoActividad.fecha.$model" :state="validateStateA('fecha')" aria-describedby="feedFecha"></b-form-input>
                  <b-form-invalid-feedback id="feedFecha">Campo requerido.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="3">
                <b-form-group label="Periodo:" label-for="periodo" class="etiqueta">
                  <b-form-select id="periodo" ref="periodo" v-model="$v.infoActividad.periodo.$model" :options="comboPeriodos" :state="validateStateA('periodo')" aria-describedby="feedPeriodo"></b-form-select>
                  <b-form-invalid-feedback id="feedPeriodo" >Campo requerido.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="12" md="12">
                <b-form-group label="Actividades*" label-for="activ" class="etiqueta">
                  <b-form-textarea id="activ" ref="activ" v-model.trim="$v.infoActividad.actividades.$model" :state="validateStateA('actividades')" aria-describedby="feedActiv" rows="4" autocomplete="off"></b-form-textarea>
                  <b-form-invalid-feedback id="feedActiv" >Campo requerido.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="12" md="12">
                <b-form-group label="Evidencias*" label-for="eviden" class="etiqueta">
                  <b-form-textarea id="eviden" ref="eviden" v-model.trim="$v.infoActividad.evidencias.$model" :state="validateStateA('evidencias')" aria-describedby="feedEviden" rows="4" autocomplete="off"></b-form-textarea>
                  <b-form-invalid-feedback id="feedEviden" >Campo requerido.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
          </b-card-text>
          <template #footer>
            <div class="float-right text-medium-emphasis text-info">* Campo requerido</div>
            <b-button class="small" variant="primary" @click="validarDatosFormulario">
              <div v-if="infoActividad.editarActividad">Actualizar Datos de la Actividad Académica</div>
              <div v-else>Crear Actividad Académica</div>
            </b-button>
            <b-button class="small ml-3" variant="secondary" @click="cancelarFormulario">Cancelar</b-button>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import { validationMixin } from "vuelidate";
  import { required, minLength } from "vuelidate/lib/validators";

  export default {
    name: 'fichaactividad',
    mixins: [validationMixin],
    props: {
      datosActividad: Object
    },
    components: {},
    data () {
      return {
        infoActividad: {
          id: null,
          id_asignatura_curso: null,
          fecha: null,
          actividades: null,
          evidencias: null,
          periodo: null,
          editarActividad: null
        },
        comboPeriodos: [
          { 'value': 1, 'text': 'PRIMERO' },
          { 'value': 2, 'text': 'SEGUNDO' },
          { 'value': 3, 'text': 'TERCERO' },
          { 'value': 4, 'text': 'CUARTO' },
        ],
      }
    },
    validations: {
      infoActividad: {
        fecha: { required },
        actividades: { required },
        evidencias: { required },
        periodo: { required },
      }
    },
    methods: {
      validarDatosFormulario() {
        this.$v.infoActividad.$touch()
        if (this.$v.infoActividad.$anyError) {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algunos campos están incompletos.')
          return false
        } else {
          let titulo = this.infoActividad.editarActividad ? 'Actualizar Datos de la Actividad Académica' : 'Crear Actividad Académica'
          let pregunta = this.infoActividad.editarActividad ? '¿Esta seguro de actualizar los datos de la Actividad Académica?' : '¿Esta seguro de crear la Actividad Académica?'
          this.$bvModal.msgBoxConfirm(pregunta, {
            headerBgVariant: 'primary',
            headerTextVariant: 'light',
            bodyBgVariant: 'light',
            bodyBgClass: 'text-center',
            title: titulo,
            size: '',
            buttonSize: 'sm',
            okVariant: 'primary',
            okTitle: 'Si, ' + titulo,
            cancelVariant: '',
            cancelTitle: 'Cancelar',
            footerClass: 'p-2',
            bodyClass: 'p-5',
            hideHeaderClose: false,
            centered: true
          })
          .then(value => {
            if (value) {
              this.guardarActividad()
            }
          })
        }
        return true
      },
      async guardarActividad() {
        if (this.infoActividad.editarActividad) {
          await axios
          .put(CONFIG.ROOT_PATH + 'docente/actividadesacademicas', JSON.stringify(this.infoActividad), { headers: {"Content-Type": "application/json; charset=utf-8" }})
          .then(response => {
            if (response.data.error){
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Actividad')
            } else{
              this.$emit("retorno", 2)
            }
          })
          .catch(err => {
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Actividad. Intente más tarde. ' + err)
          })
        } else {
          await axios
          .post(CONFIG.ROOT_PATH + 'docente/actividadesacademicas', JSON.stringify(this.infoActividad), { headers: {"Content-Type": "application/json; charset=utf-8" }})
          .then(response => {
            if (response.data.error){
              this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Crear Actividad')
            } else{
              this.$emit("retorno", 1)
            }
          })
          .catch(err => {
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Crear Area. Intente más tarde. ' + err)
          })
        }
      },
      consultaInfoActividad() {
        this.infoActividad = this.datosActividad
      },
      cancelarFormulario() {
        this.$emit("retorno", 0)
      },
      soloNumeros(e) {
        let key = window.Event ? e.which : e.keyCode
        if (!((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key == 8) || (key == 9) || (key == 37) || (key == 39))) {
            e.preventDefault()
        }
      },
      validateStateA(name) {
        const { $dirty, $error } = this.$v.infoActividad[name]
        return $dirty ? !$error : null
      },
      mensajeEmergente(variante, titulo, contenido) {
        this.$bvToast.toast(contenido, { title: titulo, variant: variante, toaster: "b-toaster-top-center", solid: true, autoHideDelay: 4000, appendToast: false })
      }
    },
    beforeMount() {
      this.consultaInfoActividad()
    }
  }
</script>