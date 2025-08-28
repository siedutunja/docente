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
              <b-col lg="3">
                <b-form-group label="Seleccione el Periodo:" label-for="periodo" class="etiqueta">
                  <b-form-select id="periodo" ref="periodo" v-model="idPeriodo" :options="comboPeriodos" @change="idPlanilla=null"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col lg="9">
                <b-form-group label="Seleccione la Planilla:" label-for="asignatura" class="etiqueta">
                  <b-form-select id="asignatura" ref="asignatura" v-model="idPlanilla" :options="comboPlanillas" @change="cargarConfiguracionPlanilla()" :disabled="idPeriodo!=null ? false : true"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
            <b-row class="mt-2">
              <b-col lg="12">
                <b-alert v-if="contPeriodos == 0" variant="danger" show><b>Periodos Cerrados:</b><hr>En el momento no tiene periodos activados.</b-alert>
              </b-col>
            </b-row>
            <b-row><b-col lg="12"><hr></b-col></b-row>
            <div v-if="idPlanilla != null && configuracionPlanilla.id_nivel != 1">
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
                  <b-card border-variant="primary">
                    <b-card-text>
                      <b-alert variant="primary" show>
                        <h2>Criterio 1:>>> {{configuracionPlanilla.nombreC1}} [ {{configuracionPlanilla.porcentajeC1}}%]</h2>
                      </b-alert>
                      <hr>
                      <b-row>
                        <b-col lg="3" md="6">
                          <b-form-group label="Número de Notas a Evaluar:" label-for="notas1" class="etiqueta">
                            <b-form-select  id="notas1" ref="notas1" v-model="encabezados.numNotasC1" :options="comboNotasC1"></b-form-select>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Cálculo de Evaluación:" label-for="calculo1" class="etiqueta">
                            <b-form-select  id="calculo1" ref="calculo1" v-model="encabezados.val01" :options="comboEvaluacion"></b-form-select>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <hr>
                      <div v-for="numEnc in encabezados.numNotasC1" :key="'C1-' + numEnc">
                        <b-row>
                          <b-col lg="9" md="6">
                            <b-form-group :label="'Encabezado Columna No. ' + numEnc + ':'" :label-for="'e-col1-'+numEnc" class="etiqueta">
                              <b-form-input :id="'e-col1-'+numEnc" v-model.trim="encabezados[encabC1[numEnc - 1]]" autocomplete="off" maxlength="50"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col lg="3" md="6" v-if="encabezados.val01">
                            <b-form-group :label="'Porcentaje ' + numEnc + ':'" :label-for="'p-col1-'+numEnc" class="etiqueta">
                              <b-form-input type="number" :id="'p-col1-'+numEnc" v-model.trim="encabezados[porceC1[numEnc - 1]]" autocomplete="off" maxlength="3" :disabled="encabezados.val01==0 ? true : false"></b-form-input>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </div>
                      <hr>
                      <b-row>
                        <b-col>
                          <b-button class="small" variant="outline-success" @click="seleccionarPlanillasC1()">Copiar Encabezados Criterio 1 <b-icon icon="box-arrow-in-right" aria-hidden="true"></b-icon></b-button>
                        </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>
              <b-row v-if="configuracionPlanilla.estadoC2 == 1">
                <b-col lg="12">
                  <b-card border-variant="primary">
                    <b-card-text>
                      <b-alert variant="primary" show>
                        <h2>Criterio 2:>>> {{configuracionPlanilla.nombreC2}} [ {{configuracionPlanilla.porcentajeC2}}%]</h2>
                      </b-alert>
                      <hr>
                      <b-row>
                        <b-col lg="3" md="6">
                          <b-form-group label="Número de Notas a Evaluar:" label-for="notas2" class="etiqueta">
                            <b-form-select  id="notas2" ref="notas2" v-model="encabezados.numNotasC2" :options="comboNotasC2"></b-form-select>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Cálculo de Evaluación:" label-for="calculo2" class="etiqueta">
                            <b-form-select  id="calculo2" ref="calculo2" v-model="encabezados.val02" :options="comboEvaluacion"></b-form-select>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <hr>
                      <div v-for="numEnc in encabezados.numNotasC2" :key="'C2-' + numEnc">
                        <b-row>
                          <b-col lg="9" md="6">
                            <b-form-group :label="'Encabezado Columna No. ' + numEnc + ':'" :label-for="'e-col2-'+numEnc" class="etiqueta">
                              <b-form-input :id="'e-col2-'+numEnc" v-model.trim="encabezados[encabC2[numEnc - 1]]" autocomplete="off" maxlength="50"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col lg="3" md="6" v-if="encabezados.val02">
                            <b-form-group :label="'Porcentaje ' + numEnc + ':'" :label-for="'p-col2-'+numEnc" class="etiqueta">
                              <b-form-input type="number" :id="'p-col2-'+numEnc" v-model.trim="encabezados[porceC2[numEnc - 1]]" autocomplete="off" maxlength="3" :disabled="encabezados.val02==0 ? true : false"></b-form-input>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </div>
                      <hr>
                      <b-row>
                        <b-col>
                          <b-button class="small" variant="outline-success" @click="seleccionarPlanillasC2()">Copiar Encabezados Criterio 2 <b-icon icon="box-arrow-in-right" aria-hidden="true"></b-icon></b-button>
                        </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>
              <b-row v-if="configuracionPlanilla.estadoC3 == 1">
                <b-col lg="12">
                  <b-card border-variant="primary">
                    <b-card-text>
                      <b-alert variant="primary" show>
                        <h2>Criterio 3:>>> {{configuracionPlanilla.nombreC3}} [ {{configuracionPlanilla.porcentajeC3}}%]</h2>
                      </b-alert>
                      <hr>
                      <b-row>
                        <b-col lg="3" md="6">
                          <b-form-group label="Número de Notas a Evaluar:" label-for="notas3" class="etiqueta">
                            <b-form-select  id="notas3" ref="notas3" v-model="encabezados.numNotasC3" :options="comboNotasC3"></b-form-select>
                          </b-form-group>
                        </b-col>
                        <b-col lg="3" md="6">
                          <b-form-group label="Cálculo de Evaluación:" label-for="calculo3" class="etiqueta">
                            <b-form-select  id="calculo3" ref="calculo3" v-model="encabezados.val03" :options="comboEvaluacion"></b-form-select>
                          </b-form-group>
                        </b-col>
                      </b-row>
                      <hr>
                      <div v-for="numEnc in encabezados.numNotasC3" :key="'C3-' + numEnc">
                        <b-row>
                          <b-col lg="9" md="6">
                            <b-form-group :label="'Encabezado Columna No. ' + numEnc + ':'" :label-for="'e-col3-'+numEnc" class="etiqueta">
                              <b-form-input :id="'e-col3-'+numEnc" v-model.trim="encabezados[encabC3[numEnc - 1]]" autocomplete="off" maxlength="50"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col lg="3" md="6" v-if="encabezados.val03">
                            <b-form-group :label="'Porcentaje ' + numEnc + ':'" :label-for="'p-col3-'+numEnc" class="etiqueta">
                              <b-form-input type="number" :id="'p-col3-'+numEnc" v-model.trim="encabezados[porceC3[numEnc - 1]]" autocomplete="off" maxlength="3" :disabled="encabezados.val03==0 ? true : false"></b-form-input>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </div>
                      <hr>
                      <b-row>
                        <b-col>
                          <b-button class="small" variant="outline-success" @click="seleccionarPlanillasC3()">Copiar Encabezados Criterio 3 <b-icon icon="box-arrow-in-right" aria-hidden="true"></b-icon></b-button>
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
                <b-col>
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
    <b-modal ref="modalCopiarEncabezados" size="xl" scrollable hide-footer title="Seleccione las planillas a donde se van a copiar la configuración" ok-only>
      <div class="mx-3">
        <b-card header-bg-variant="secondary">
          <vue-good-table ref="planillasCopy" :columns="encabColumnas" :rows="listaPlanillas" styleClass="vgt-table condensed bordered striped"
            :select-options="{enabled: true, selectOnCheckboxOnly: true, selectionText: 'Marcados', clearSelectionText: 'Desmarcar', selectAllByGroup: true}">
            <div slot="selected-row-actions">
              <b-button v-if="criterio==1" class="mr-2" variant="primary" @click="copiarEncabezadosC1()">Copiar Configuración del Criterio 1 <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
              <b-button v-if="criterio==2" class="mr-2" variant="primary" @click="copiarEncabezadosC2()">Copiar Configuración del Criterio 2  <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
              <b-button v-if="criterio==3" class="mr-2" variant="primary" @click="copiarEncabezadosC3()">Copiar Configuración del Criterio 3 <b-icon icon="box-arrow-in-down" aria-hidden="true"></b-icon></b-button>
            </div>
            <div slot="emptystate">
              <h5 class="text-danger ml-5">No existen planillas para copiar</h5>
            </div>
          </vue-good-table>
        </b-card>
        <b-button class="small mx-1 mt-2" variant="secondary" @click="cancelarFormulario">Cancelar</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from "axios"
  import * as CONFIG from '@/assets/config.js'
  import 'vue-good-table/dist/vue-good-table.css'
  import { VueGoodTable } from 'vue-good-table'

  export default {
    name: 'configurarplanillas',
    components: {
      VueGoodTable
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
          { 'value': 1, 'text': 'PORCENTUAL'}
        ],
        comboNotasC1: [
          { 'value': 1, 'text': 1},
          { 'value': 2, 'text': 2},
          { 'value': 3, 'text': 3},
          { 'value': 4, 'text': 4},
          { 'value': 5, 'text': 5},
          { 'value': 6, 'text': 6},
          { 'value': 7, 'text': 7},
          { 'value': 8, 'text': 8},
          { 'value': 9, 'text': 9},
          { 'value': 10, 'text': 10}
        ],
        comboNotasC2: [
          { 'value': 1, 'text': 1},
          { 'value': 2, 'text': 2},
          { 'value': 3, 'text': 3},
          { 'value': 4, 'text': 4},
          { 'value': 5, 'text': 5},
          { 'value': 6, 'text': 6},
          { 'value': 7, 'text': 7},
          { 'value': 8, 'text': 8},
          { 'value': 9, 'text': 9},
          { 'value': 10, 'text': 10}
        ],
        comboNotasC3: [
          { 'value': 1, 'text': 1},
          { 'value': 2, 'text': 2},
          { 'value': 3, 'text': 3},
          { 'value': 4, 'text': 4},
          { 'value': 5, 'text': 5},
          { 'value': 6, 'text': 6},
          { 'value': 7, 'text': 7},
          { 'value': 8, 'text': 8},
          { 'value': 9, 'text': 9},
          { 'value': 10, 'text': 10}
        ],
        listaPlanillas: [],
        encabColumnas : [
          { label: 'Planillas a Copiar Configuración', field: 'asignatura', sortable: false },
          { label: 'Curso', field: 'curso', sortable: false },
          { label: 'Periodo', field: 'periodo', sortable: false },
        ],
        contPeriodos: 0,
        encabC1: [],
        encabC2: [],
        encabC3: [],
        porceC1: [],
        porceC2: [],
        porceC3: [],
        criterio: null
      }
    },
    methods: {
      async copiarEncabezadosC1() {
        let planillasSeleccionadasCopiar = []
        this.$refs.planillasCopy.selectedRows.forEach(element => {
          planillasSeleccionadasCopiar.push(element)
        })
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/copiarencabezados/c1', JSON.stringify(planillasSeleccionadasCopiar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Copia encabezados')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La configuración del Criterio 1 y los encabezados se han copiado correctamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Copia encabezados. Intente más tarde. ' + err)
        })
        this.cancelarFormulario()
      },
      async copiarEncabezadosC2() {
        let planillasSeleccionadasCopiar = []
        this.$refs.planillasCopy.selectedRows.forEach(element => {
          planillasSeleccionadasCopiar.push(element)
        })
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/copiarencabezados/c2', JSON.stringify(planillasSeleccionadasCopiar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Copia encabezados')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La configuración del Criterio 2 y los encabezados se han copiado correctamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Copia encabezados. Intente más tarde. ' + err)
        })
        this.cancelarFormulario()
      },
      async copiarEncabezadosC3() {
        let planillasSeleccionadasCopiar = []
        this.$refs.planillasCopy.selectedRows.forEach(element => {
          planillasSeleccionadasCopiar.push(element)
        })
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/copiarencabezados/c3', JSON.stringify(planillasSeleccionadasCopiar), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Copia encabezados')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La configuración del Criterio 3 y los encabezados se han copiado correctamente.')
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Copia encabezados. Intente más tarde. ' + err)
        })
        this.cancelarFormulario()
      },
      seleccionarPlanillasC1() {
        this.listaPlanillas.forEach(element => {
          element.periodo = this.idPeriodo
          element.enc1 = this.encabezados.enc01
          element.enc2 = this.encabezados.enc02
          element.enc3 = this.encabezados.enc03
          element.enc4 = this.encabezados.enc04
          element.enc5 = this.encabezados.enc05
          element.enc6 = this.encabezados.enc16
          element.enc7 = this.encabezados.enc17
          element.enc8 = this.encabezados.enc18
          element.enc9 = this.encabezados.enc19
          element.enc10 = this.encabezados.enc20
          element.por1 = this.encabezados.por01
          element.por2 = this.encabezados.por02
          element.por3 = this.encabezados.por03
          element.por4 = this.encabezados.por04
          element.por5 = this.encabezados.por05
          element.por6 = this.encabezados.por16
          element.por7 = this.encabezados.por17
          element.por8 = this.encabezados.por18
          element.por9 = this.encabezados.por19
          element.por10 = this.encabezados.por20
          element.numNotas = this.encabezados.numNotasC1
          element.valor = this.encabezados.val01
        })
        this.criterio = 1
        this.$refs['modalCopiarEncabezados'].show()
      },
      seleccionarPlanillasC2() {
        this.listaPlanillas.forEach(element => {
          element.periodo = this.idPeriodo
          element.enc1 = this.encabezados.enc06
          element.enc2 = this.encabezados.enc07
          element.enc3 = this.encabezados.enc08
          element.enc4 = this.encabezados.enc09
          element.enc5 = this.encabezados.enc10
          element.enc6 = this.encabezados.enc21
          element.enc7 = this.encabezados.enc22
          element.enc8 = this.encabezados.enc23
          element.enc9 = this.encabezados.enc24
          element.enc10 = this.encabezados.enc25
          element.por1 = this.encabezados.por06
          element.por2 = this.encabezados.por07
          element.por3 = this.encabezados.por08
          element.por4 = this.encabezados.por09
          element.por5 = this.encabezados.por10
          element.por6 = this.encabezados.por21
          element.por7 = this.encabezados.por22
          element.por8 = this.encabezados.por23
          element.por9 = this.encabezados.por24
          element.por10 = this.encabezados.por25
          element.numNotas = this.encabezados.numNotasC2
          element.valor = this.encabezados.val02
        })
        this.criterio = 2
        this.$refs['modalCopiarEncabezados'].show()
      },
      seleccionarPlanillasC3() {
        this.listaPlanillas.forEach(element => {
          element.periodo = this.idPeriodo
          element.enc1 = this.encabezados.enc11
          element.enc2 = this.encabezados.enc12
          element.enc3 = this.encabezados.enc13
          element.enc4 = this.encabezados.enc14
          element.enc5 = this.encabezados.enc15
          element.enc6 = this.encabezados.enc26
          element.enc7 = this.encabezados.enc27
          element.enc8 = this.encabezados.enc28
          element.enc9 = this.encabezados.enc29
          element.enc10 = this.encabezados.enc30
          element.por1 = this.encabezados.por11
          element.por2 = this.encabezados.por12
          element.por3 = this.encabezados.por13
          element.por4 = this.encabezados.por14
          element.por5 = this.encabezados.por15
          element.por6 = this.encabezados.por26
          element.por7 = this.encabezados.por27
          element.por8 = this.encabezados.por28
          element.por9 = this.encabezados.por29
          element.por10 = this.encabezados.por30
          element.numNotas = this.encabezados.numNotasC3
          element.valor = this.encabezados.val03
        })
        this.criterio = 3
        this.$refs['modalCopiarEncabezados'].show()
      },



      cancelarFormulario() {
        this.$refs['modalCopiarEncabezados'].hide()
      },
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
        })
        this.encabezados = {}
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/configuracion/planilla', {params: {idPlanilla: this.idPlanilla, idPeriodo: this.idPeriodo}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Encabezados Planilla')
          } else{
            if (response.data.datos != 0) {
              this.encabezados = response.data.datos
              //console.log(JSON.stringify(this.encabezados))
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Encabezados Planilla. Intente más tarde.' + err)
        })
        this.encabC1 = ['enc01','enc02','enc03','enc04','enc05','enc16','enc17','enc18','enc19','enc20']
        this.encabC2 = ['enc06','enc07','enc08','enc09','enc10','enc21','enc22','enc23','enc24','enc25']
        this.encabC3 = ['enc11','enc12','enc13','enc14','enc15','enc26','enc27','enc28','enc29','enc30']
        this.porceC1 = ['por01','por02','por03','por04','por05','por16','por17','por18','por19','por20']
        this.porceC2 = ['por06','por07','por08','por09','por10','por21','por22','por23','por24','por25']
        this.porceC3 = ['por11','por12','por13','por14','por15','por26','por27','por28','por29','por30']
        //console.log(JSON.stringify(this.configuracionPlanilla))
      },
      async ocuparComboPlanillas() {
        this.comboPlanillas = []
        this.listaPlanillas = []
        this.$store.state.listaPlanillasDocente.forEach(element => {
          this.comboPlanillas.push({ 'value': element.idPlanilla, 'text': element.nomenclatura.toUpperCase() + ' - ' + element.asignatura.toUpperCase() })
          this.listaPlanillas.push({ 
            'idAsigCurso': element.idPlanilla, 
            'asignatura': element.asignatura.toUpperCase(),
            'curso': element.nomenclatura.toUpperCase(),
            'enc1': '','enc2': '','enc3': '','enc4': '','enc5': '','enc6': '','enc7': '','enc8': '','enc9': '','enc10': '',
            'por1': '','por2': '','por3': '','por4': '','por5': '','por6': '','por7': '','por8': '','por9': '','por10': '',
            'numNotas': '',
            'valor': '',
            'periodo': null
          })
        })
        //console.log(JSON.stringify(this.$store.state.listaPlanillasDocente))
      },
      async ocuparComboPeriodos() {
        this.comboPeriodos = []
        let fechaVigencia = 0
        let restaVigencia = 0
        this.$store.state.datosTablas.periodos.forEach(element => {
          if (element.id == 1) {
            fechaVigencia = new Date(this.$store.state.notasP1_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
          if (element.id == 2) {
            fechaVigencia = new Date(this.$store.state.notasP2_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
          if (element.id == 3) {
            fechaVigencia = new Date(this.$store.state.notasP3_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
          if (element.id == 4) {
            fechaVigencia = new Date(this.$store.state.notasP4_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
          if (element.id == 5) {
            fechaVigencia = new Date(this.$store.state.notasP5_Fin)
            fechaVigencia = fechaVigencia.getTime()
            restaVigencia = this.$store.state.fechaActual - (fechaVigencia + 86400000)
            if (restaVigencia < 0) {
              this.comboPeriodos.push({ 'value': element.id, 'text': element.periodo.toUpperCase() })
              this.contPeriodos++
            }
          }
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