<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> CONFIGURAR PLANILLAS</h5>
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
            <div v-if="idPeriodo != null && configuracionPlanilla.id_nivel != 1">
              <b-row>
                <b-col lg="12">
                  <b-card border-variant="primary" title="Conceptos Valorativos">
                    <b-card-text>
                      <hr>
                      <b-row>
                        <b-col lg="3">
                          <div>
                            <b-alert variant="danger" show>
                              <b-row>
                                <b-col lg="12">
                                  <h5>BAJO</h5><hr>
                                </b-col>
                                <b-col lg="6" md="6">
                                  <b-form-group label="Mínima:" class="etiqueta">
                                    <h4>{{this.configuracionPlanilla.minBaj}}</h4>
                                  </b-form-group>
                                </b-col>
                                <b-col lg="6" md="6">
                                  <b-form-group label="Máxima:" class="etiqueta">
                                    <h4>{{this.configuracionPlanilla.maxBaj}}</h4>
                                  </b-form-group>
                                </b-col>
                              </b-row>  
                            </b-alert>
                          </div>
                        </b-col>
                        <b-col lg="3">
                          <div>
                            <b-alert variant="info" show>
                              <b-row>
                                <b-col lg="12">
                                  <h5>BASICO</h5><hr>
                                </b-col>
                                <b-col lg="6" md="6">
                                  <b-form-group label="Mínima:" class="etiqueta">
                                    <h4>{{this.configuracionPlanilla.minBas}}</h4>
                                  </b-form-group>
                                </b-col>
                                <b-col lg="6" md="6">
                                  <b-form-group label="Máxima:" class="etiqueta">
                                    <h4>{{this.configuracionPlanilla.maxBas}}</h4>
                                  </b-form-group>
                                </b-col>
                              </b-row>  
                            </b-alert>
                          </div>
                        </b-col>
                        <b-col lg="3">
                          <div>
                            <b-alert variant="warning" show>
                              <b-row>
                                <b-col lg="12">
                                  <h5>ALTO</h5><hr>
                                </b-col>
                                <b-col lg="6" md="6">
                                  <b-form-group label="Mínima:" class="etiqueta">
                                    <h4>{{this.configuracionPlanilla.minAlt}}</h4>
                                  </b-form-group>
                                </b-col>
                                <b-col lg="6" md="6">
                                  <b-form-group label="Máxima:" class="etiqueta">
                                    <h4>{{this.configuracionPlanilla.maxAlt}}</h4>
                                  </b-form-group>
                                </b-col>
                              </b-row>  
                            </b-alert>
                          </div>
                        </b-col>
                        <b-col lg="3">
                          <div>
                            <b-alert variant="success" show>
                              <b-row>
                                <b-col lg="12">
                                  <h5>SUPERIOR</h5><hr>
                                </b-col>
                                <b-col lg="6" md="6">
                                  <b-form-group label="Mínima:" class="etiqueta">
                                    <h4>{{this.configuracionPlanilla.minSup}}</h4>
                                  </b-form-group>
                                </b-col>
                                <b-col lg="6" md="6">
                                  <b-form-group label="Máxima:" class="etiqueta">
                                    <h4>{{this.configuracionPlanilla.maxSup}}</h4>
                                  </b-form-group>
                                </b-col>
                              </b-row>  
                            </b-alert>
                          </div>
                        </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>
              <b-row v-if="configuracionPlanilla.estadoC1 == 1">
                <b-col lg="12">
                  <b-card border-variant="primary" title="Criterio de Evaluación No. 1">
                    <b-card-text>
                      <hr>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Nombre del Criterio:" label-for="criterio1" class="etiqueta">
                            <b-form-input id="criterio1" ref="criterio1" v-model.trim="configuracionPlanilla.nombreC1" aria-describedby="feedCriterio1" autocomplete="off" maxlength="15" disabled></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="pcriterio1" class="etiqueta">
                            <b-form-input type="number" id="pcriterio1" ref="pcriterio1" v-model.trim="configuracionPlanilla.porcentajeC1" aria-describedby="feedpCriterio1" autocomplete="off" maxlength="3" disabled></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="3" md="6">
                          <b-form-group label="Cálculo de Evaluación:" label-for="calculo1" class="etiqueta">
                            <b-form-select  id="calculo1" ref="calculo1" v-model="encabezados.val01" :options="comboEvaluacion"></b-form-select>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <hr>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 1:" label-for="e-col1-1" class="etiqueta">
                            <b-form-input id="e-col1-1" v-model.trim="encabezados.enc01" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-1" class="etiqueta">
                            <b-form-input type="number" id="p-col1-1" v-model.trim="encabezados.por01" autocomplete="off" maxlength="3" :disabled="encabezados.val01==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 2:" label-for="e-col1-2" class="etiqueta">
                            <b-form-input id="e-col1-2" v-model.trim="encabezados.enc02" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-2" class="etiqueta">
                            <b-form-input type="number" id="p-col1-2" v-model.trim="encabezados.por02" autocomplete="off" maxlength="3" :disabled="encabezados.val01==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 3:" label-for="e-col1-3" class="etiqueta">
                            <b-form-input id="e-col1-3" v-model.trim="encabezados.enc03" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-3" class="etiqueta">
                            <b-form-input type="number" id="p-col1-3" v-model.trim="encabezados.por03" autocomplete="off" maxlength="3" :disabled="encabezados.val01==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 4:" label-for="e-col1-4" class="etiqueta">
                            <b-form-input id="e-col1-4" v-model.trim="encabezados.enc04" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-4" class="etiqueta">
                            <b-form-input type="number" id="p-col1-4" v-model.trim="encabezados.por04" autocomplete="off" maxlength="3" :disabled="encabezados.val01==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 5:" label-for="e-col1-5" class="etiqueta">
                            <b-form-input id="e-col1-5" v-model.trim="encabezados.enc05" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-5" class="etiqueta">
                            <b-form-input type="number" id="p-col1-5" v-model.trim="encabezados.por05" autocomplete="off" maxlength="3" :disabled="encabezados.val01==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>
              <b-row v-if="configuracionPlanilla.estadoC2 == 1">
                <b-col lg="12">
                  <b-card border-variant="primary" title="Criterio de Evaluación No. 2">
                    <b-card-text>
                      <hr>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Nombre del Criterio:" label-for="criterio2" class="etiqueta">
                            <b-form-input id="criterio2" ref="criterio2" v-model.trim="configuracionPlanilla.nombreC2" aria-describedby="feedCriterio2" autocomplete="off" maxlength="15" disabled></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="pcriterio2" class="etiqueta">
                            <b-form-input type="number" id="pcriterio2" ref="pcriterio2" v-model.trim="configuracionPlanilla.porcentajeC2" aria-describedby="feedpCriterio2" autocomplete="off" maxlength="3" disabled></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="3" md="6">
                          <b-form-group label="Cálculo de Evaluación:" label-for="calculo2" class="etiqueta">
                            <b-form-select  id="calculo2" ref="calculo2" v-model="encabezados.val02" :options="comboEvaluacion"></b-form-select>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <hr>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 1:" label-for="e-col1-6" class="etiqueta">
                            <b-form-input id="e-col1-6" v-model.trim="encabezados.enc06" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-6" class="etiqueta">
                            <b-form-input type="number" id="p-col1-6" v-model.trim="encabezados.por06" autocomplete="off" maxlength="3" :disabled="encabezados.val02==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 2:" label-for="e-col1-7" class="etiqueta">
                            <b-form-input id="e-col1-7" v-model.trim="encabezados.enc07" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-7" class="etiqueta">
                            <b-form-input type="number" id="p-col1-7" v-model.trim="encabezados.por07" autocomplete="off" maxlength="3" :disabled="encabezados.val02==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 3:" label-for="e-col1-8" class="etiqueta">
                            <b-form-input id="e-col1-8" v-model.trim="encabezados.enc08" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-8" class="etiqueta">
                            <b-form-input type="number" id="p-col1-8" v-model.trim="encabezados.por08" autocomplete="off" maxlength="3" :disabled="encabezados.val02==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 4:" label-for="e-col1-9" class="etiqueta">
                            <b-form-input id="e-col1-9" v-model.trim="encabezados.enc09" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-9" class="etiqueta">
                            <b-form-input type="number" id="p-col1-9" v-model.trim="encabezados.por09" autocomplete="off" maxlength="3" :disabled="encabezados.val02==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 5:" label-for="e-col1-10" class="etiqueta">
                            <b-form-input id="e-col1-10" v-model.trim="encabezados.enc10" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-10" class="etiqueta">
                            <b-form-input type="number" id="p-col1-10" v-model.trim="encabezados.por10" autocomplete="off" maxlength="3" :disabled="encabezados.val02==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>
              <b-row v-if="configuracionPlanilla.estadoC3 == 1">
                <b-col lg="12">
                  <b-card border-variant="primary" title="Criterio de Evaluación No. 3">
                    <b-card-text>
                      <hr>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Nombre del Criterio:" label-for="criterio3" class="etiqueta">
                            <b-form-input id="criterio3" ref="criterio3" v-model.trim="configuracionPlanilla.nombreC3" aria-describedby="feedCriterio3" autocomplete="off" maxlength="15" disabled></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="pcriterio3" class="etiqueta">
                            <b-form-input type="number" id="pcriterio3" ref="pcriterio3" v-model.trim="configuracionPlanilla.porcentajeC3" aria-describedby="feedpCriterio3" autocomplete="off" maxlength="3" disabled></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="3" md="6">
                          <b-form-group label="Cálculo de Evaluación:" label-for="calculo3" class="etiqueta">
                            <b-form-select  id="calculo3" ref="calculo3" v-model="encabezados.val03" :options="comboEvaluacion"></b-form-select>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <hr>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 1:" label-for="e-col1-11" class="etiqueta">
                            <b-form-input id="e-col1-11" v-model.trim="encabezados.enc11" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-11" class="etiqueta">
                            <b-form-input type="number" id="p-col1-11" v-model.trim="encabezados.por11" autocomplete="off" maxlength="3" :disabled="encabezados.val03==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 2:" label-for="e-col1-12" class="etiqueta">
                            <b-form-input id="e-col1-12" v-model.trim="encabezados.enc12" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-12" class="etiqueta">
                            <b-form-input type="number" id="p-col1-12" v-model.trim="encabezados.por12" autocomplete="off" maxlength="3" :disabled="encabezados.val03==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 3:" label-for="e-col1-13" class="etiqueta">
                            <b-form-input id="e-col1-13" v-model.trim="encabezados.enc13" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-13" class="etiqueta">
                            <b-form-input type="number" id="p-col1-13" v-model.trim="encabezados.por13" autocomplete="off" maxlength="3" :disabled="encabezados.val03==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 4:" label-for="e-col1-14" class="etiqueta">
                            <b-form-input id="e-col1-14" v-model.trim="encabezados.enc14" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-14" class="etiqueta">
                            <b-form-input type="number" id="p-col1-14" v-model.trim="encabezados.por14" autocomplete="off" maxlength="3" :disabled="encabezados.val03==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col lg="9" md="6">
                          <b-form-group label="Encabezado Columna No. 5:" label-for="e-col1-15" class="etiqueta">
                            <b-form-input id="e-col1-15" v-model.trim="encabezados.enc15" autocomplete="off" maxlength="50"></b-form-input>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Porcentaje:" label-for="p-col1-15" class="etiqueta">
                            <b-form-input type="number" id="p-col1-15" v-model.trim="encabezados.por15" autocomplete="off" maxlength="3" :disabled="encabezados.val03==0 ? true : false"></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="12">
                  <b-button class="small mx-1 mt-2" variant="primary" @click="validarDatosFormulario">Guardar Configuración de la planilla</b-button>
                </b-col>
              </b-row>
            </div>
            <div v-else-if="configuracionPlanilla.id_nivel == 1">
              <h4>Esta planilla corresponde al nivel de Preescolar y no necesita configurar los Criterios de Evaluación</h4>
            </div>
          </b-card-text>
          <template #footer>
            <em>Configurar Planillas.</em>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'

  export default {
    name: 'configurarplanillas',
    components: {
    },
    data () {
      return {
        idPlanilla: null,
        comboPlanillas: [],
        idPeriodo: null,
        comboPeriodos: [],
        configuracionPlanilla: {},
        encabezados: {},
        comboEvaluacion: [
          { 'value': 0, 'text': 'EQUITATIVO'},
          //{ 'value': 1, 'text': 'PORCENTUAL'}
        ]
      }
    },
    methods: {
      validarDatosFormulario() {
        let titulo = 'Actualizar Configuración'
        let pregunta = '¿Esta seguro de actualizar la Configuración de la Planilla?'
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
            this.guardarConfiguracion()
          }
        })
      },
      async guardarConfiguracion() {
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/configuracion/planilla', JSON.stringify(this.encabezados), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Encabezados')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La configuración de la planilla se actualizó correctamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Encabezados. Intente más tarde. ' + err)
        })
      },
      async cargarConfiguracionPlanilla() {
        this.configuracionPlanilla = {}
        this.$store.state.listaPlanillasDocente.forEach(element => {
          if (element.idPlanilla == this.idPlanilla) {
            this.configuracionPlanilla = element
          }
          console.log(JSON.stringify(this.configuracionPlanilla))
          this.cargarEncabezados()
        })
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
              console.log(JSON.stringify(this.encabezados))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Encabezados Planilla. Intente más tarde.' + err)
        })
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
        })
        //console.log(JSON.stringify(this.$store.state.listaPlanillasDocente))
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