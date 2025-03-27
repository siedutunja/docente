<template>
  <div>
    <b-row class="mt-2">
      <b-col lg="12">
        <b-card>
          <template #header>
            <h5 class="mb-0"><b-icon icon="card-checklist" aria-hidden="true"></b-icon> EVALUACIÓN PARCIAL POR PERIODO</h5>
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
            <div v-if="idPlanilla != null">
              <b-row v-if="planillita == 1">
                <b-col>
                  <vue-good-table ref="notas1" :columns="encabColumnas1" :rows="notasPlanilla" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'estudiante'">
                        <span :style="(colorConcepto(props.row.id_estado_actual))"><strong>{{props.row.estudiante}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'diversa'">
                        <span><strong>{{props.row.diversa}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'n1C1'">
                        <b-form-input v-model="props.row.n1C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n2C1'">
                        <b-form-input v-model="props.row.n2C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n3C1'">
                        <b-form-input v-model="props.row.n3C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n4C1'">
                        <b-form-input v-model="props.row.n4C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n5C1'">
                        <b-form-input v-model="props.row.n5C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'definitiva'">
                        <span><strong>{{Number(props.row.definitiva) > 0 ? Number(props.row.definitiva) : null}}</strong></span>
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
                      <b-button class="small mx-1 mt-4" variant="primary" @click="botonGuardando = true,guardarPlanilla()">Guardar Planilla Parcial</b-button>
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
              <b-row v-else-if="planillita == 2">
                <b-col>
                  <vue-good-table ref="notas1" :columns="encabColumnas1" :rows="notasPlanilla" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'estudiante'">
                        <span :style="(colorConcepto(props.row.id_estado_actual))"><strong>{{props.row.estudiante}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'diversa'">
                        <span><strong>{{props.row.diversa}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'n1C1'">
                        <b-form-input v-model="props.row.n1C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n2C1'">
                        <b-form-input v-model="props.row.n2C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n3C1'">
                        <b-form-input v-model="props.row.n3C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n4C1'">
                        <b-form-input v-model="props.row.n4C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n5C1'">
                        <b-form-input v-model="props.row.n5C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'defC1'">
                        <span><strong>{{Number(props.row.defC1) > 0 ? Number(props.row.defC1) : null}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'n1C2'">
                        <b-form-input v-model="props.row.n1C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n2C2'">
                        <b-form-input v-model="props.row.n2C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n3C2'">
                        <b-form-input v-model="props.row.n3C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n4C2'">
                        <b-form-input v-model="props.row.n4C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n5C2'">
                        <b-form-input v-model="props.row.n5C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'defC2'">
                        <span><strong>{{Number(props.row.defC2) > 0 ? Number(props.row.defC2) : null}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'definitiva'">
                        <span><strong>{{Number(props.row.definitiva) > 0 ? Number(props.row.definitiva) : null}}</strong></span>
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
                      <b-button class="small mx-1 mt-4" variant="primary" @click="botonGuardando = true,guardarPlanilla()">Guardar Planilla Parcial</b-button>
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
              <b-row v-else-if="planillita == 3">
                <b-col>
                  <vue-good-table ref="notas1" :columns="encabColumnas1" :rows="notasPlanilla" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'estudiante'">
                        <span :style="(colorConcepto(props.row.id_estado_actual))"><strong>{{props.row.estudiante}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'diversa'">
                        <span><strong>{{props.row.diversa}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'n1C1'">
                        <b-form-input v-model="props.row.n1C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n2C1'">
                        <b-form-input v-model="props.row.n2C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n3C1'">
                        <b-form-input v-model="props.row.n3C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n4C1'">
                        <b-form-input v-model="props.row.n4C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n5C1'">
                        <b-form-input v-model="props.row.n5C1" @blur="actualizarItemC1(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'defC1'">
                        <span><strong>{{Number(props.row.defC1) > 0 ? Number(props.row.defC1) : null}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'n1C2'">
                        <b-form-input v-model="props.row.n1C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n2C2'">
                        <b-form-input v-model="props.row.n2C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n3C2'">
                        <b-form-input v-model="props.row.n3C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n4C2'">
                        <b-form-input v-model="props.row.n4C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n5C2'">
                        <b-form-input v-model="props.row.n5C2" @blur="actualizarItemC2(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'defC2'">
                        <span><strong>{{Number(props.row.defC2) > 0 ? Number(props.row.defC2) : null}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'n1C3'">
                        <b-form-input v-model="props.row.n1C3" @blur="actualizarItemC3(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n2C3'">
                        <b-form-input v-model="props.row.n2C3" @blur="actualizarItemC3(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n3C3'">
                        <b-form-input v-model="props.row.n3C3" @blur="actualizarItemC3(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n4C3'">
                        <b-form-input v-model="props.row.n4C3" @blur="actualizarItemC3(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'n5C3'">
                        <b-form-input v-model="props.row.n5C3" @blur="actualizarItemC3(props.row)" autocomplete="off" maxlength="3" @keydown="soloDecimales" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'defC3'">
                        <span><strong>{{Number(props.row.defC3) > 0 ? Number(props.row.defC3) : null}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'definitiva'">
                        <span><strong>{{Number(props.row.definitiva) > 0 ? Number(props.row.definitiva) : null}}</strong></span>
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
                      <b-button class="small mx-1 mt-4" variant="primary" @click="botonGuardando = true,guardarPlanilla()">Guardar Planilla Parcial</b-button>
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
              <b-row v-else-if="planillita == 4">
                <b-col>
                  <vue-good-table ref="notas4" :columns="encabColumnas2" :rows="notasPlanillaPree" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'estudiante'">
                        <span :style="(colorConcepto(props.row.id_estado_actual))"><strong>{{props.row.estudiante}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'diversa'">
                        <span><strong>{{props.row.diversa}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'definitivapree'">
                        <b-form-input v-model="props.row.definitivapree" @blur="actualizarItemPree(props.row)" autocomplete="off" maxlength="1" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'concepto'">
                        <span><strong>{{props.row.concepto}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'ausJ'">
                        <b-form-input v-model="props.row.ausJ" @blur="actualizarFallasPree(props.row)" autocomplete="off" maxlength="3" @keydown="soloNumeros" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'ausS'">
                        <b-form-input v-model="props.row.ausS" @blur="actualizarFallasPree(props.row)" autocomplete="off" maxlength="3" @keydown="soloNumeros" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                    </template>
                    <div slot="emptystate">
                      <h5 class="text-danger ml-5">No existen estudiantes en la planilla</h5>
                    </div>
                  </vue-good-table>
                  <b-row>
                    <b-col v-if="!botonGuardando">
                      <b-button class="small mx-1 mt-4" variant="primary" @click="botonGuardando = true,guardarPlanillaPreescolar()">Guardar Planilla Parcial</b-button>
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
              <b-row v-else-if="planillita == 5">
                <b-col>
                  <vue-good-table ref="notas4" :columns="encabColumnas3" :rows="notasPlanillaCompor" styleClass="vgt-table condensed bordered striped" :line-numbers="true">
                    <template slot="table-row" slot-scope="props">
                      <span v-if="props.column.field == 'estudiante'">
                        <span :style="(colorConcepto(props.row.id_estado_actual))"><strong>{{props.row.estudiante}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'definitivacompor'">
                        <b-form-input v-model="props.row.definitivacompor" @blur="actualizarItemCompor(props.row)" autocomplete="off" maxlength="1" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'diversa'">
                        <span><strong>{{props.row.diversa}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'concepto'">
                        <span><strong>{{props.row.concepto}}</strong></span>
                      </span>
                      <span v-if="props.column.field == 'observaciones'">
                        <b-form-input v-model="props.row.observaciones" @blur="actualizarItemCompor(props.row)" autocomplete="off" maxlength="255" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'ausJ'">
                        <b-form-input v-model="props.row.ausJ" @blur="actualizarFallasCompor(props.row)" autocomplete="off" maxlength="3" @keydown="soloNumeros" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                      <span v-if="props.column.field == 'ausS'">
                        <b-form-input v-model="props.row.ausS" @blur="actualizarFallasCompor(props.row)" autocomplete="off" maxlength="3" @keydown="soloNumeros" :disabled="props.row.id_estado_actual==1 ? false : true"></b-form-input>
                      </span>
                    </template>
                    <div slot="emptystate">
                      <h5 class="text-danger ml-5">No existen estudiantes en la planilla</h5>
                    </div>
                  </vue-good-table>
                  <b-row>
                    <b-col v-if="!botonGuardando">
                      <b-button class="small mx-1 mt-4" variant="primary" @click="botonGuardando = true,guardarPlanillaComportamiento()">Guardar Planilla Parcial</b-button>
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
              <b-row v-else>
                <b-col>

                </b-col>
              </b-row>
            </div>
          </b-card-text>
          <template #footer>
            <!--{{notasPlanilla}}-->
            <em>Planilla de evaluación parcial por periodo.</em>
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
    name: 'planillaparcialperiodo',
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
        notasPlanillaPree: [],
        notasPlanillaCompor: [],
        encabColumnas1 : [],
        encabColumnas2 : [],
        encabColumnas3 : [],
        botonGuardando: false,
        planillita: 1,
      }
    },
    methods: {
      async guardarPlanillaPreescolar() {
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/notas/planillapree', JSON.stringify(this.notasPlanillaPree), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Planilla Preescolar')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La planilla parcial de evaluaciones se ha guardado satisfactoriamente.')
            this.botonGuardando = false
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Planilla Preescolar. Intente más tarde. ' + err)
        })
      },
      async guardarPlanillaComportamiento() {
        await axios
        .put(CONFIG.ROOT_PATH + 'docente/notas/planillacompor', JSON.stringify(this.notasPlanillaCompor), { headers: {"Content-Type": "application/json; charset=utf-8" }})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Actualizar Planilla Comportamiento')
          } else{
            this.mensajeEmergente('success',CONFIG.TITULO_MSG,'La planilla parcial de evaluaciones se ha guardado satisfactoriamente.')
            this.botonGuardando = false
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Actualizar Planilla Comportamiento. Intente más tarde. ' + err)
        })
      },
      async guardarPlanilla() {
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
      actualizarFallasPree(item) {
        let indice = this.notasPlanillaPree.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.ausJ == '' || item.ausJ == null) {
          this.notasPlanillaPree[indice].ausJ = null
        } else  {
          this.notasPlanillaPree[indice].ausJ = item.ausJ
        }
        if (item.ausS == '' || item.ausS == null) {
          this.notasPlanillaPree[indice].ausS = null
        } else  {
          this.notasPlanillaPree[indice].ausS = item.ausS
        }
      },
      actualizarFallasCompor(item) {
        let indice = this.notasPlanillaCompor.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.ausJ == '' || item.ausJ == null) {
          this.notasPlanillaCompor[indice].ausJ = null
        } else  {
          this.notasPlanillaCompor[indice].ausJ = item.ausJ
        }
        if (item.ausS == '' || item.ausS == null) {
          this.notasPlanillaCompor[indice].ausS = null
        } else  {
          this.notasPlanillaCompor[indice].ausS = item.ausS
        }
      },
      actualizarItemPree(item) {
        let indice = this.notasPlanillaPree.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.definitivapree == '' || item.definitivapree == null) {
          this.notasPlanillaPree[indice].definitivapree = null
          item.definitivapree = null
        } else  {
          if (item.definitivapree == this.configuracionPlanilla.preeL1 || item.definitivapree == this.configuracionPlanilla.preeL2 || item.definitivapree == this.configuracionPlanilla.preeL3 || item.definitivapree == this.configuracionPlanilla.preeL4) {
            this.notasPlanillaPree[indice].definitivapree = item.definitivapree
          } else {
            this.notasPlanillaPree[indice].definitivapree = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación: ' + item.definitivapree  + ' no es válida.')
            item.definitivapree = null
          }
        }
        if (item.definitivapree == this.configuracionPlanilla.preeL1) {
          this.notasPlanillaPree[indice].concepto = this.configuracionPlanilla.preeC1
        } else if (item.definitivapree == this.configuracionPlanilla.preeL2) {
          this.notasPlanillaPree[indice].concepto = this.configuracionPlanilla.preeC2
        } else if (item.definitivapree == this.configuracionPlanilla.preeL3) {
          this.notasPlanillaPree[indice].concepto = this.configuracionPlanilla.preeC3
        } else if (item.definitivapree == this.configuracionPlanilla.preeL4) {
          this.notasPlanillaPree[indice].concepto = this.configuracionPlanilla.preeC4
        } else {
          this.notasPlanillaPree[indice].concepto = null
        }
      },
      actualizarItemCompor(item) {
        let indice = this.notasPlanillaCompor.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.observaciones == '' || item.observaciones == null) {
          this.notasPlanillaCompor[indice].observaciones = null
          item.observaciones = null
        } else  {
          this.notasPlanillaCompor[indice].observaciones = item.observaciones
        }
        if (item.definitivacompor == '' || item.definitivacompor == null) {
          this.notasPlanillaCompor[indice].definitivacompor = null
          item.definitivacompor = null
        } else  {
          if (item.definitivacompor == this.configuracionPlanilla.compL1 || item.definitivacompor == this.configuracionPlanilla.compL2 || item.definitivacompor == this.configuracionPlanilla.compL3 || item.definitivacompor == this.configuracionPlanilla.compL4) {
            this.notasPlanillaCompor[indice].definitivacompor = item.definitivacompor
          } else {
            this.notasPlanillaCompor[indice].definitivacompor = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación: ' + item.definitivacompor  + ' no es válida.')
            item.definitivacompor = null
          }
        }
        if (item.definitivacompor == this.configuracionPlanilla.compL1) {
          this.notasPlanillaCompor[indice].concepto = this.configuracionPlanilla.compC1
        } else if (item.definitivacompor == this.configuracionPlanilla.compL2) {
          this.notasPlanillaCompor[indice].concepto = this.configuracionPlanilla.compC2
        } else if (item.definitivacompor == this.configuracionPlanilla.compL3) {
          this.notasPlanillaCompor[indice].concepto = this.configuracionPlanilla.compC3
        } else if (item.definitivacompor == this.configuracionPlanilla.compL4) {
          this.notasPlanillaCompor[indice].concepto = this.configuracionPlanilla.compC4
        } else {
          this.notasPlanillaCompor[indice].concepto = null
        }
      },
      actualizarItemC1(item) {
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
          this.notasPlanilla[indice].defC1 = null
          this.notasPlanilla[indice].definitiva = null
        } else {
          this.notasPlanilla[indice].defC1 = Number(sumaNotas / i).toFixed(1)
        }
        if (this.planillita == 1) {
          this.notasPlanilla[indice].definitiva = Number(sumaNotas / i).toFixed(1)
        }
        if (this.planillita == 2) {
          this.notasPlanilla[indice].definitiva = Number(Number(Number(this.notasPlanilla[indice].defC1) * this.configuracionPlanilla.porcentajeC1 / 100) + Number(Number(this.notasPlanilla[indice].defC2) * this.configuracionPlanilla.porcentajeC2 / 100)).toFixed(1)
        }
        if (this.planillita == 3) {
          this.notasPlanilla[indice].definitiva = Number(Number(Number(this.notasPlanilla[indice].defC1) * this.configuracionPlanilla.porcentajeC1 / 100) + Number(Number(this.notasPlanilla[indice].defC2) * this.configuracionPlanilla.porcentajeC2 / 100) + Number(Number(this.notasPlanilla[indice].defC3) * this.configuracionPlanilla.porcentajeC3 / 100)).toFixed(1)
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
      actualizarItemC2(item) {
        let indice = this.notasPlanilla.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.n1C2 == '' || item.n1C2 == null || item.n1C2 == 0) {
          this.notasPlanilla[indice].n1C2 = null
          item.n1C2 = null
        } else  {
          if (item.n1C2 >= this.configuracionPlanilla.minBaj && item.n1C2 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n1C2 = item.n1C2
          } else {
            this.notasPlanilla[indice].n1C2 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n1C2  + ' no es válida.')
            item.n1C2 = null
          }
        }
        if (item.n2C2 == '' || item.n2C2 == null || item.n2C2 == 0) {
          this.notasPlanilla[indice].n2C2 = null
          item.n2C2 = null
        } else  {
          if (item.n2C2 >= this.configuracionPlanilla.minBaj && item.n2C2 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n2C2 = item.n2C2
          } else {
            this.notasPlanilla[indice].n2C2 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n2C2  + ' no es válida.')
            item.n2C2 = null
          }
        }
        if (item.n3C2 == '' || item.n3C2 == null || item.n3C2 == 0) {
          this.notasPlanilla[indice].n3C2 = null
          item.n3C2 = null
        } else  {
          if (item.n3C2 >= this.configuracionPlanilla.minBaj && item.n3C2 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n3C2 = item.n3C2
          } else {
            this.notasPlanilla[indice].n3C2 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n3C2  + ' no es válida.')
            item.n3C2 = null
          }
        }
        if (item.n4C2 == '' || item.n4C2 == null || item.n4C2 == 0) {
          this.notasPlanilla[indice].n4C2 = null
          item.n4C2 = null
        } else  {
          if (item.n4C2 >= this.configuracionPlanilla.minBaj && item.n4C2 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n4C2 = item.n4C2
          } else {
            this.notasPlanilla[indice].n4C2 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n4C2  + ' no es válida.')
            item.n4C2 = null
          }
        }
        if (item.n5C2 == '' || item.n5C2 == null || item.n5C2 == 0) {
          this.notasPlanilla[indice].n5C2 = null
          item.n5C2 = null
        } else  {
          if (item.n5C2 >= this.configuracionPlanilla.minBaj && item.n5C2 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n5C2 = item.n5C2
          } else {
            this.notasPlanilla[indice].n5C2 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n5C2  + ' no es válida.')
            item.n5C2 = null
          }
        }
        let i = 0
        let sumaNotas = 0
        if (this.notasPlanilla[indice].n1C2 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n1C2)
          i++
        }
        if (this.notasPlanilla[indice].n2C2 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n2C2)
          i++
        }
        if (this.notasPlanilla[indice].n3C2 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n3C2)
          i++
        }
        if (this.notasPlanilla[indice].n4C2 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n4C2)
          i++
        }
        if (this.notasPlanilla[indice].n5C2 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n5C2)
          i++
        }
        if (i == 0) {
          this.notasPlanilla[indice].defC2 = null
        } else {
          this.notasPlanilla[indice].defC2 = Number(sumaNotas / i).toFixed(1)
        }
        if (this.planillita == 2) {
          this.notasPlanilla[indice].definitiva = Number(Number(Number(this.notasPlanilla[indice].defC1) * this.configuracionPlanilla.porcentajeC1 / 100) + Number(Number(this.notasPlanilla[indice].defC2) * this.configuracionPlanilla.porcentajeC2 / 100)).toFixed(1)
        }
        if (this.planillita == 3) {
          this.notasPlanilla[indice].definitiva = Number(Number(Number(this.notasPlanilla[indice].defC1) * this.configuracionPlanilla.porcentajeC1 / 100) + Number(Number(this.notasPlanilla[indice].defC2) * this.configuracionPlanilla.porcentajeC2 / 100) + Number(Number(this.notasPlanilla[indice].defC3) * this.configuracionPlanilla.porcentajeC3 / 100)).toFixed(1)
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
      actualizarItemC3(item) {
        let indice = this.notasPlanilla.findIndex(asigna => asigna.idMatricula === item.idMatricula)
        if (item.n1C3 == '' || item.n1C3 == null || item.n1C3 == 0) {
          this.notasPlanilla[indice].n1C3 = null
          item.n1C3 = null
        } else  {
          if (item.n1C3 >= this.configuracionPlanilla.minBaj && item.n1C3 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n1C3 = item.n1C3
          } else {
            this.notasPlanilla[indice].n1C3 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n1C3  + ' no es válida.')
            item.n1C3 = null
          }
        }
        if (item.n2C3 == '' || item.n2C3 == null || item.n2C3 == 0) {
          this.notasPlanilla[indice].n2C3 = null
          item.n2C3 = null
        } else  {
          if (item.n2C3 >= this.configuracionPlanilla.minBaj && item.n2C3 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n2C3 = item.n2C3
          } else {
            this.notasPlanilla[indice].n2C3 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n2C3  + ' no es válida.')
            item.n2C3 = null
          }
        }
        if (item.n3C3 == '' || item.n3C3 == null || item.n3C3 == 0) {
          this.notasPlanilla[indice].n3C3 = null
          item.n3C3 = null
        } else  {
          if (item.n3C3 >= this.configuracionPlanilla.minBaj && item.n3C3 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n3C3 = item.n3C3
          } else {
            this.notasPlanilla[indice].n3C3 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n3C3  + ' no es válida.')
            item.n3C3 = null
          }
        }
        if (item.n4C3 == '' || item.n4C3 == null || item.n4C3 == 0) {
          this.notasPlanilla[indice].n4C3 = null
          item.n4C3 = null
        } else  {
          if (item.n4C3 >= this.configuracionPlanilla.minBaj && item.n4C3 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n4C3 = item.n4C3
          } else {
            this.notasPlanilla[indice].n4C3 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n4C3  + ' no es válida.')
            item.n4C3 = null
          }
        }
        if (item.n5C3 == '' || item.n5C3 == null || item.n5C3 == 0) {
          this.notasPlanilla[indice].n5C3 = null
          item.n5C3 = null
        } else  {
          if (item.n5C3 >= this.configuracionPlanilla.minBaj && item.n5C3 <= this.configuracionPlanilla.maxSup) {
            this.notasPlanilla[indice].n5C3 = item.n5C3
          } else {
            this.notasPlanilla[indice].n5C3 = null
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'La evaluación (nota): ' + item.n5C3  + ' no es válida.')
            item.n5C3 = null
          }
        }
        let i = 0
        let sumaNotas = 0
        if (this.notasPlanilla[indice].n1C3 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n1C3)
          i++
        }
        if (this.notasPlanilla[indice].n2C3 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n2C3)
          i++
        }
        if (this.notasPlanilla[indice].n3C3 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n3C3)
          i++
        }
        if (this.notasPlanilla[indice].n4C3 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n4C3)
          i++
        }
        if (this.notasPlanilla[indice].n5C3 > 0) {
          sumaNotas += Number(this.notasPlanilla[indice].n5C3)
          i++
        }
        if (i == 0) {
          this.notasPlanilla[indice].defC3 = null
        } else {
          this.notasPlanilla[indice].defC3 = Number(sumaNotas / i).toFixed(1)
        }
        if (this.planillita == 3) {
          this.notasPlanilla[indice].definitiva = Number(Number(Number(this.notasPlanilla[indice].defC1) * this.configuracionPlanilla.porcentajeC1 / 100) + Number(Number(this.notasPlanilla[indice].defC2) * this.configuracionPlanilla.porcentajeC2 / 100) + Number(Number(this.notasPlanilla[indice].defC3) * this.configuracionPlanilla.porcentajeC3 / 100)).toFixed(1)
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
        this.planillita = 0
        this.idCurso = null,
        this.$store.state.listaPlanillasDocente.forEach(element => {
          if (element.idPlanilla == this.idPlanilla) {
            this.configuracionPlanilla = element
            this.idCurso = element.idCurso
            if (this.configuracionPlanilla.orden == 99) {
              this.planillita = 5
              this.cargarNotasPeriodoComportamiento()
            } else {
              if (this.configuracionPlanilla.id_nivel > 1 && this.configuracionPlanilla.id_nivel < 7) {
                if (this.configuracionPlanilla.estadoC1 == 1 && this.configuracionPlanilla.estadoC2 == 0 && this.configuracionPlanilla.estadoC3 == 0) {
                  this.planillita = 1
                } else if (this.configuracionPlanilla.estadoC1 == 1 && this.configuracionPlanilla.estadoC2 == 1 && this.configuracionPlanilla.estadoC3 == 0) {
                  this.planillita = 2
                } else if (this.configuracionPlanilla.estadoC1 == 1 && this.configuracionPlanilla.estadoC2 == 1 && this.configuracionPlanilla.estadoC3 == 1) {
                  this.planillita = 3
                }
                this.cargarEncabezados()
              } else if (this.configuracionPlanilla.id_nivel == 1) {
                this.planillita = 4
                this.cargarNotasPeriodoPreescolar()
              } else {
                this.mensajeEmergente('info',CONFIG.TITULO_MSG,'Lo sentimos, algo salio mal con la planilla seleccionada.')
              }
            }
          }
        })
      },
      async cargarNotasPeriodoComportamiento() {
        this.notasPlanillaCompor = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/notas/planillacompor', {params: {idCurso: this.idCurso, idPeriodo: this.idPeriodo, idPlanilla: this.idPlanilla}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Notas periodo Comportamiento')
          } else{
            if (response.data.datos != 0) {
              response.data.datos.forEach(element => {
                if(element.ausJ === undefined) element.ausJ = null
                if(element.ausS === undefined) element.ausS = null
                if(element.definitivacompor === undefined) element.definitivacompor = null
                if(element.concepto === undefined) element.concepto = null
                if(element.observaciones === undefined) element.observaciones = null
                element.id_asignatura_curso = this.idPlanilla
                element.periodo = this.idPeriodo
              })
              this.notasPlanillaCompor = response.data.datos
              //console.log(JSON.stringify(this.notasPlanilla))
              this.construirPlanillaNotasComportamiento()
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Notas periodo Comportamiento. Intente más tarde.' + err)
        })
      },
      construirPlanillaNotasComportamiento() {
        this.encabColumnas3 = [
          { label: 'Apellidos y Nombres Estudiante', field: 'estudiante', sortable: false },
          { label: '', field: 'diversa', sortable: false, tdClass: this.tdClassFuncDiversa },
          { label: 'Definitiva', field: 'definitivacompor', width: '120px', sortable: false },
          { label: 'Concepto', field: 'concepto', width: '110px', sortable: false, tdClass: this.tdClassFuncConceptoCompor },
          { label: 'Observaciones_del_Periodo', field: 'observaciones', sortable: false },
          { label: 'AJ', field: 'ausJ', width: '80px', sortable: false },
          { label: 'AS', field: 'ausS', width: '80px', sortable: false },
        ]
      },
      async cargarNotasPeriodoPreescolar() {
        this.notasPlanillaPree = []
        await axios
        .get(CONFIG.ROOT_PATH + 'docente/notas/planillapree', {params: {idCurso: this.idCurso, idPeriodo: this.idPeriodo, idPlanilla: this.idPlanilla}})
        .then(response => {
          if (response.data.error){
            this.mensajeEmergente('danger',CONFIG.TITULO_MSG,response.data.mensaje + ' - Notas periodo Preescolar')
          } else{
            if (response.data.datos != 0) {
              response.data.datos.forEach(element => {
                if(element.ausJ === undefined) element.ausJ = null
                if(element.ausS === undefined) element.ausS = null
                if(element.definitivapree === undefined) element.definitivapree = null
                if(element.concepto === undefined) element.concepto = null
                element.id_asignatura_curso = this.idPlanilla
                element.periodo = this.idPeriodo
              })
              this.notasPlanillaPree = response.data.datos
              //console.log(JSON.stringify(this.notasPlanillaPree))
              this.construirPlanillaNotasPreescolar()
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Notas periodo. Intente más tarde.' + err)
        })
      },
      construirPlanillaNotasPreescolar() {
        this.encabColumnas2 = [
          { label: 'Apellidos y Nombres Estudiante', field: 'estudiante', sortable: false },
          { label: '', field: 'diversa', sortable: false, tdClass: this.tdClassFuncDiversa },
          { label: 'Definitiva', field: 'definitivapree', sortable: false },
          { label: 'Concepto', field: 'concepto', width: '400px', sortable: false, tdClass: this.tdClassFuncConceptoPree },
          { label: 'Justificadas', field: 'ausJ', sortable: false },
          { label: 'Sin justificar', field: 'ausS', sortable: false },
        ]
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
              this.cargarNotasPeriodo()
            }
          }
        })
        .catch(err => {
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Algo salio mal y no se pudo realizar: Encabezados Planilla. Intente más tarde.' + err)
        })
      },
      async cargarNotasPeriodo() {
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
        let enca6 = ''
        let enca7 = ''
        let enca8 = ''
        let enca9 = ''
        let enca10 = ''
        let enca11 = ''
        let enca12 = ''
        let enca13 = ''
        let enca14 = ''
        let enca15 = ''
        if (this.planillita == 1) {
          if (this.encabezados.val01 == 0) {
            if (this.encabezados.enc01 == null || this.encabezados.enc01 == '') this.encabezados.enc01 = 'N1'
            if (this.encabezados.enc02 == null || this.encabezados.enc02 == '') this.encabezados.enc02 = 'N2'
            if (this.encabezados.enc03 == null || this.encabezados.enc03 == '') this.encabezados.enc03 = 'N3'
            if (this.encabezados.enc04 == null || this.encabezados.enc04 == '') this.encabezados.enc04 = 'N4'
            if (this.encabezados.enc05 == null || this.encabezados.enc05 == '') this.encabezados.enc05 = 'N5'
            enca1 = this.encabezados.enc01 + '\n___\nEQ'
            enca2 = this.encabezados.enc02 + '\n___\nEQ'
            enca3 = this.encabezados.enc03 + '\n___\nEQ'
            enca4 = this.encabezados.enc04 + '\n___\nEQ'
            enca5 = this.encabezados.enc05 + '\n___\nEQ'
            this.encabColumnas1 = [
              { label: 'Apellidos y Nombres Estudiante', field: 'estudiante', sortable: false },
              { label: '', field: 'diversa', width: '50px', sortable: false, tdClass: this.tdClassFuncDiversa },
              { label: 'N1', field: 'n1C1', width: '60px', sortable: false, tooltip: enca1 },
              { label: 'N2', field: 'n2C1', width: '60px', sortable: false, tooltip: enca2 },
              { label: 'N3', field: 'n3C1', width: '60px', sortable: false, tooltip: enca3 },
              { label: 'N4', field: 'n4C1', width: '60px', sortable: false, tooltip: enca4 },
              { label: 'N5', field: 'n5C1', width: '60px', sortable: false, tooltip: enca5 },
              { label: 'DEFINITIVA', field: 'definitiva', width: '85px', sortable: false, sortable: false, tdClass: this.tdClassFuncDefinitiva, thClass: 'text-center' },
              { label: 'Concepto', field: 'concepto', width: '110px', sortable: false, tdClass: this.tdClassFuncConcepto },
              { label: 'AJ', field: 'ausJ', width: '60px', sortable: false, tooltip: 'Ausencias Justificadas' },
              { label: 'AS', field: 'ausS', width: '60px', sortable: false, tooltip: 'Ausencias Sin Justificar' },
            ]


          } else {
            // planilla porcentual
          }
          //, tooltip: 'A simple tooltip'  //, hidden: true
        } else if (this.planillita == 2) {
          if (this.encabezados.val02 == 0) {
            if (this.encabezados.enc01 == null || this.encabezados.enc01 == '') this.encabezados.enc01 = 'N1'
            if (this.encabezados.enc02 == null || this.encabezados.enc02 == '') this.encabezados.enc02 = 'N2'
            if (this.encabezados.enc03 == null || this.encabezados.enc03 == '') this.encabezados.enc03 = 'N3'
            if (this.encabezados.enc04 == null || this.encabezados.enc04 == '') this.encabezados.enc04 = 'N4'
            if (this.encabezados.enc05 == null || this.encabezados.enc05 == '') this.encabezados.enc05 = 'N5'
            if (this.encabezados.enc06 == null || this.encabezados.enc06 == '') this.encabezados.enc06 = 'N1'
            if (this.encabezados.enc07 == null || this.encabezados.enc07 == '') this.encabezados.enc07 = 'N2'
            if (this.encabezados.enc08 == null || this.encabezados.enc08 == '') this.encabezados.enc08 = 'N3'
            if (this.encabezados.enc09 == null || this.encabezados.enc09 == '') this.encabezados.enc09 = 'N4'
            if (this.encabezados.enc10 == null || this.encabezados.enc10 == '') this.encabezados.enc10 = 'N5'
            enca1 = this.encabezados.enc01 + '\n___\nEQ'
            enca2 = this.encabezados.enc02 + '\n___\nEQ'
            enca3 = this.encabezados.enc03 + '\n___\nEQ'
            enca4 = this.encabezados.enc04 + '\n___\nEQ'
            enca5 = this.encabezados.enc05 + '\n___\nEQ'
            enca6 = this.encabezados.enc06 + '\n___\nEQ'
            enca7 = this.encabezados.enc07 + '\n___\nEQ'
            enca8 = this.encabezados.enc08 + '\n___\nEQ'
            enca9 = this.encabezados.enc09 + '\n___\nEQ'
            enca10 = this.encabezados.enc10 + '\n___\nEQ'
            this.encabColumnas1 = [
              { label: 'Apellidos y Nombres Estudiante', field: 'estudiante', sortable: false },
              { label: '', field: 'diversa', width: '50px', sortable: false, tdClass: this.tdClassFuncDiversa },
              { label: 'N1', field: 'n1C1', width: '60px', sortable: false, tooltip: enca1 },
              { label: 'N2', field: 'n2C1', width: '60px', sortable: false, tooltip: enca2 },
              { label: 'N3', field: 'n3C1', width: '60px', sortable: false, tooltip: enca3 },
              { label: 'N4', field: 'n4C1', width: '60px', sortable: false, tooltip: enca4 },
              { label: 'N5', field: 'n5C1', width: '60px', sortable: false, tooltip: enca5 },
              { label: this.configuracionPlanilla.nombreC1+'\n*****\n'+this.configuracionPlanilla.porcentajeC1+'%', field: 'defC1', width: '85px', sortable: false, tdClass: this.tdClassFuncC1, thClass: 'text-center' },
              { label: 'N1', field: 'n1C2', width: '60px', sortable: false, tooltip: enca6 },
              { label: 'N2', field: 'n2C2', width: '60px', sortable: false, tooltip: enca7 },
              { label: 'N3', field: 'n3C2', width: '60px', sortable: false, tooltip: enca8 },
              { label: 'N4', field: 'n4C2', width: '60px', sortable: false, tooltip: enca9 },
              { label: 'N5', field: 'n5C2', width: '60px', sortable: false, tooltip: enca10 },
              { label: this.configuracionPlanilla.nombreC2+'\n*****\n'+this.configuracionPlanilla.porcentajeC2+'%', field: 'defC2', width: '85px', sortable: false, tdClass: this.tdClassFuncC2, thClass: 'text-center' },
              { label: 'DEFINITIVA', field: 'definitiva', width: '90px', sortable: false, tdClass: this.tdClassFuncDefinitiva, thClass: 'text-center' },
              { label: 'Concepto', field: 'concepto', width: '110px', sortable: false, tdClass: this.tdClassFuncConcepto },
              { label: 'AJ', field: 'ausJ', width: '60px', sortable: false, tooltip: 'Ausencias Justificadas' },
              { label: 'AS', field: 'ausS', width: '60px', sortable: false, tooltip: 'Ausencias Sin Justificar' },
            ]


          } else {
            // planilla porcentual
          }
          //, tooltip: 'A simple tooltip'  //, hidden: true
        } else if(this.planillita == 3) {       
          if (this.encabezados.val02 == 0) {
            if (this.encabezados.enc01 == null || this.encabezados.enc01 == '') this.encabezados.enc01 = 'N1'
            if (this.encabezados.enc02 == null || this.encabezados.enc02 == '') this.encabezados.enc02 = 'N2'
            if (this.encabezados.enc03 == null || this.encabezados.enc03 == '') this.encabezados.enc03 = 'N3'
            if (this.encabezados.enc04 == null || this.encabezados.enc04 == '') this.encabezados.enc04 = 'N4'
            if (this.encabezados.enc05 == null || this.encabezados.enc05 == '') this.encabezados.enc05 = 'N5'
            if (this.encabezados.enc06 == null || this.encabezados.enc06 == '') this.encabezados.enc06 = 'N1'
            if (this.encabezados.enc07 == null || this.encabezados.enc07 == '') this.encabezados.enc07 = 'N2'
            if (this.encabezados.enc08 == null || this.encabezados.enc08 == '') this.encabezados.enc08 = 'N3'
            if (this.encabezados.enc09 == null || this.encabezados.enc09 == '') this.encabezados.enc09 = 'N4'
            if (this.encabezados.enc10 == null || this.encabezados.enc10 == '') this.encabezados.enc10 = 'N5'
            if (this.encabezados.enc11 == null || this.encabezados.enc11 == '') this.encabezados.enc11 = 'N1'
            if (this.encabezados.enc12 == null || this.encabezados.enc12 == '') this.encabezados.enc12 = 'N2'
            if (this.encabezados.enc13 == null || this.encabezados.enc13 == '') this.encabezados.enc13 = 'N3'
            if (this.encabezados.enc14 == null || this.encabezados.enc14 == '') this.encabezados.enc14 = 'N4'
            if (this.encabezados.enc15 == null || this.encabezados.enc15 == '') this.encabezados.enc15 = 'N5'
            enca1 = this.encabezados.enc01 + '\n___\nEQ'
            enca2 = this.encabezados.enc02 + '\n___\nEQ'
            enca3 = this.encabezados.enc03 + '\n___\nEQ'
            enca4 = this.encabezados.enc04 + '\n___\nEQ'
            enca5 = this.encabezados.enc05 + '\n___\nEQ'
            enca6 = this.encabezados.enc06 + '\n___\nEQ'
            enca7 = this.encabezados.enc07 + '\n___\nEQ'
            enca8 = this.encabezados.enc08 + '\n___\nEQ'
            enca9 = this.encabezados.enc09 + '\n___\nEQ'
            enca10 = this.encabezados.enc10 + '\n___\nEQ'
            enca11 = this.encabezados.enc11 + '\n___\nEQ'
            enca12 = this.encabezados.enc12 + '\n___\nEQ'
            enca13 = this.encabezados.enc13 + '\n___\nEQ'
            enca14 = this.encabezados.enc14 + '\n___\nEQ'
            enca15 = this.encabezados.enc15 + '\n___\nEQ'
            this.encabColumnas1 = [
              { label: 'Apellidos y Nombres Estudiante', field: 'estudiante', sortable: false },
              { label: '', field: 'diversa', width: '50px', sortable: false, tdClass: this.tdClassFuncDiversa },
              { label: 'N1', field: 'n1C1', width: '60px', sortable: false, tooltip: enca1 },
              { label: 'N2', field: 'n2C1', width: '60px', sortable: false, tooltip: enca2 },
              { label: 'N3', field: 'n3C1', width: '60px', sortable: false, tooltip: enca3 },
              { label: 'N4', field: 'n4C1', width: '60px', sortable: false, tooltip: enca4 },
              { label: 'N5', field: 'n5C1', width: '60px', sortable: false, tooltip: enca5 },
              { label: this.configuracionPlanilla.nombreC1+'\n*****\n'+this.configuracionPlanilla.porcentajeC1+'%', field: 'defC1', width: '85px', sortable: false, tdClass: this.tdClassFuncC1, thClass: 'text-center' },
              { label: 'N1', field: 'n1C2', width: '60px', sortable: false, tooltip: enca6 },
              { label: 'N2', field: 'n2C2', width: '60px', sortable: false, tooltip: enca7 },
              { label: 'N3', field: 'n3C2', width: '60px', sortable: false, tooltip: enca8 },
              { label: 'N4', field: 'n4C2', width: '60px', sortable: false, tooltip: enca9 },
              { label: 'N5', field: 'n5C2', width: '60px', sortable: false, tooltip: enca10 },
              { label: this.configuracionPlanilla.nombreC2+'\n*****\n'+this.configuracionPlanilla.porcentajeC2+'%', field: 'defC2', width: '85px', sortable: false, tdClass: this.tdClassFuncC2, thClass: 'text-center' },
              { label: 'N1', field: 'n1C3', width: '60px', sortable: false, tooltip: enca11 },
              { label: 'N2', field: 'n2C3', width: '60px', sortable: false, tooltip: enca12 },
              { label: 'N3', field: 'n3C3', width: '60px', sortable: false, tooltip: enca13 },
              { label: 'N4', field: 'n4C3', width: '60px', sortable: false, tooltip: enca14 },
              { label: 'N5', field: 'n5C3', width: '60px', sortable: false, tooltip: enca15 },
              { label: this.configuracionPlanilla.nombreC3+'\n*****\n'+this.configuracionPlanilla.porcentajeC3+'%', field: 'defC3', width: '85px', sortable: false, tdClass: this.tdClassFuncC3, thClass: 'text-center' },
              { label: 'DEFINITIVA', field: 'definitiva', width: '90px', sortable: false, tdClass: this.tdClassFuncDefinitiva, thClass: 'text-center' },
              { label: 'Concepto', field: 'concepto', width: '110px', sortable: false, tdClass: this.tdClassFuncConcepto },
              { label: 'AJ', field: 'ausJ', width: '60px', sortable: false, tooltip: 'Ausencias Justificadas' },
              { label: 'AS', field: 'ausS', width: '60px', sortable: false, tooltip: 'Ausencias Sin Justificar' },
            ]


          } else {
            // planilla porcentual
          }
          //, tooltip: 'A simple tooltip'  //, hidden: true
        } else {       
          this.mensajeEmergente('danger',CONFIG.TITULO_MSG,'Los criterios de evaluación se encuentran mal configurados y no se puede mostrar la planilla de evaluación parcial.')
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
      tdClassFuncC1(fila) {
        if (fila.defC1 >= this.configuracionPlanilla.minBaj && fila.defC1 <= this.configuracionPlanilla.maxBaj) {
          return 'text-danger text-center bg-light'
        } else if (fila.defC1 >= this.configuracionPlanilla.minBas && fila.defC1 <= this.configuracionPlanilla.maxBas) {
          return 'text-primary text-center bg-light'
        } else if (fila.defC1 >= this.configuracionPlanilla.minAlt && fila.defC1 <= this.configuracionPlanilla.maxAlt) {
          return 'text-warning text-center bg-light'
        } else if (fila.defC1 >= this.configuracionPlanilla.minSup && fila.defC1 <= this.configuracionPlanilla.maxSup) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tdClassFuncC2(fila) {
        if (fila.defC2 >= this.configuracionPlanilla.minBaj && fila.defC2 <= this.configuracionPlanilla.maxBaj) {
          return 'text-danger text-center bg-light'
        } else if (fila.defC2 >= this.configuracionPlanilla.minBas && fila.defC2 <= this.configuracionPlanilla.maxBas) {
          return 'text-primary text-center bg-light'
        } else if (fila.defC2 >= this.configuracionPlanilla.minAlt && fila.defC2 <= this.configuracionPlanilla.maxAlt) {
          return 'text-warning text-center bg-light'
        } else if (fila.defC2 >= this.configuracionPlanilla.minSup && fila.defC2 <= this.configuracionPlanilla.maxSup) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tdClassFuncC3(fila) {
        if (fila.defC3 >= this.configuracionPlanilla.minBaj && fila.defC3 <= this.configuracionPlanilla.maxBaj) {
          return 'text-danger text-center bg-light'
        } else if (fila.defC3 >= this.configuracionPlanilla.minBas && fila.defC3 <= this.configuracionPlanilla.maxBas) {
          return 'text-primary text-center bg-light'
        } else if (fila.defC3 >= this.configuracionPlanilla.minAlt && fila.defC3 <= this.configuracionPlanilla.maxAlt) {
          return 'text-warning text-center bg-light'
        } else if (fila.defC3 >= this.configuracionPlanilla.minSup && fila.defC3 <= this.configuracionPlanilla.maxSup) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tdClassFuncDefinitiva(fila) {
        if (fila.definitiva >= this.configuracionPlanilla.minBaj && fila.definitiva <= this.configuracionPlanilla.maxBaj) {
          return 'text-danger text-center bg-secondary'
        } else if (fila.definitiva >= this.configuracionPlanilla.minBas && fila.definitiva <= this.configuracionPlanilla.maxBas) {
          return 'text-primary text-center bg-secondary'
        } else if (fila.definitiva >= this.configuracionPlanilla.minAlt && fila.definitiva <= this.configuracionPlanilla.maxAlt) {
          return 'text-warning text-center bg-secondary'
        } else if (fila.definitiva >= this.configuracionPlanilla.minSup && fila.definitiva <= this.configuracionPlanilla.maxSup) {
          return 'text-success text-center bg-secondary'
        }
        return 'text-secondary text-center bg-secondary'
      },
      tdClassFuncConcepto(fila) {
        if (fila.definitiva >= this.configuracionPlanilla.minBaj && fila.definitiva <= this.configuracionPlanilla.maxBaj) {
          return 'text-danger bg-secondary'
        } else if (fila.definitiva >= this.configuracionPlanilla.minBas && fila.definitiva <= this.configuracionPlanilla.maxBas) {
          return 'text-primary bg-secondary'
        } else if (fila.definitiva >= this.configuracionPlanilla.minAlt && fila.definitiva <= this.configuracionPlanilla.maxAlt) {
          return 'text-warning bg-secondary'
        } else if (fila.definitiva >= this.configuracionPlanilla.minSup && fila.definitiva <= this.configuracionPlanilla.maxSup) {
          return 'text-success bg-secondary'
        }
        return 'text-secondary bg-secondary'
      },
      tdClassFuncConceptoPree(fila) {
        if (fila.definitivapree == this.configuracionPlanilla.preeL1) {
          return 'text-danger text-center bg-light'
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL2) {
          return 'text-primary text-center bg-light'
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL3) {
          return 'text-warning text-center bg-light'
        } else if (fila.definitivapree == this.configuracionPlanilla.preeL4) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary bg-light'
      },
      tdClassFuncConceptoCompor(fila) {
        if (fila.definitivacompor == this.configuracionPlanilla.compL1) {
          return 'text-danger text-center bg-light'
        } else if (fila.definitivacompor == this.configuracionPlanilla.compL2) {
          return 'text-primary text-center bg-light'
        } else if (fila.definitivacompor == this.configuracionPlanilla.compL3) {
          return 'text-warning text-center bg-light'
        } else if (fila.definitivacompor == this.configuracionPlanilla.compL4) {
          return 'text-success text-center bg-light'
        }
        return 'text-secondary text-center bg-light'
      },
      tdClassFuncDiversa(fila) {
        if (fila.id_diversa == 'S') {
          return 'text-center text-white alert alert-info'
        }
        //return 'text-secondary text-center bg-light'
      },
      thClassFuncEncabezado(fila) {
        return 'text-center'
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