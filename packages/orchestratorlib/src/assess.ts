/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {IConfusionMatrix} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrixExact} from '@microsoft/bf-dispatcher';
import {MultiLabelConfusionMatrixSubset} from '@microsoft/bf-dispatcher';

import {Label}  from './label';
import {OrchestratorHelper} from './orchestratorhelper';
import {PredictionLabelStructure} from './predictionlabelstructure';
import {PredictionStructure} from './predictionstructure';

import {Utility} from './utility';

export class OrchestratorAssess {
  public static readonly assessmentSetIntentSummaryHtmlOutputFilename: string = 'orchestrator_assessment_set_intent_summary.html';

  public static readonly assessmentSetIntentLabelsOutputFilename: string = 'orchestrator_assessment_set_intent_labels.txt';

  public static readonly assessmentSetEntitySummaryHtmlOutputFilename: string = 'orchestrator_assessment_set_entity_summary.html';

  public static readonly assessmentSetEntityLabelsOutputFilename: string = 'orchestrator_assessment_set_entity_labels.txt';

  // eslint-disable-next-line complexity
  // eslint-disable-next-line max-params
  public static async runAsync(
    inputPath: string, predictionPath: string, outputPath: string): Promise<void> {
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process arguments --------------------------------------
    if (Utility.isEmptyString(inputPath)) {
      Utility.debuggingThrow(`Please provide ground-truth file file, CWD=${process.cwd()}, called from OrchestratorAssess.runAsync()`);
    }
    if (Utility.isEmptyString(predictionPath)) {
      Utility.debuggingThrow(`Please provide a assess file, CWD=${process.cwd()}, called from OrchestratorAssess.runAsync()`);
    }
    if (Utility.isEmptyString(outputPath)) {
      Utility.debuggingThrow(`Please provide an output directory, CWD=${process.cwd()}, called from OrchestratorAssess.runAsync()`);
    }
    Utility.debuggingLog(`inputPath=${inputPath}`);
    Utility.debuggingLog(`predictionPath=${predictionPath}`);
    Utility.debuggingLog(`outputPath=${outputPath}`);
    // ---- NOTE ---- load the ground truth set ------------------------------
    const groundTruthFile: string = inputPath;
    if (!Utility.exists(groundTruthFile)) {
      Utility.debuggingThrow(`ground-truth set file does not exist, groundTruthFile=${groundTruthFile}`);
    }
    const predictionFile: string = predictionPath;
    if (!Utility.exists(predictionFile)) {
      Utility.debuggingThrow(`prediction set file does not exist, predictionFile=${predictionFile}`);
    }
    const assessmentSetIntentSummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetIntentSummaryHtmlOutputFilename);
    const assessmentSetIntentLabelsOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetIntentLabelsOutputFilename);
    const assessmentSetEntitySummaryHtmlOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetEntitySummaryHtmlOutputFilename);
    const assessmentSetEntityLabelsOutputFilename: string = path.join(outputPath, OrchestratorAssess.assessmentSetEntityLabelsOutputFilename);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process the ground-truth set, retrieve labels ----------
    const groundTruthFileProcessedUtteranceLabelsMap: {
      'utteranceLabelsMap': { [id: string]: string[] };
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': { [id: string]: Label[] };
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } =
      await OrchestratorHelper.getUtteranceLabelsMap(groundTruthFile, false);
    const groundTruthSetUtteranceLabelsMap: { [id: string]: string[] } =
      groundTruthFileProcessedUtteranceLabelsMap.utteranceLabelsMap;
    const groundTruthSetUtteranceLabelDuplicateMap: Map<string, Set<string>> =
      groundTruthFileProcessedUtteranceLabelsMap.utteranceLabelDuplicateMap;
    const groundTruthSetUtteranceEntityLabelsMap: { [id: string]: Label[] } =
      groundTruthFileProcessedUtteranceLabelsMap.utteranceEntityLabelsMap;
    const groundTruthSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]> =
      groundTruthFileProcessedUtteranceLabelsMap.utteranceEntityLabelDuplicateMap;
    // ---- NOTE-REFACTORED ---- const groundTruthSetUtteranceLabelsMap: { [id: string]: string[] } = {};
    // ---- NOTE-REFACTORED ---- const groundTruthSetUtteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    // ---- NOTE-REFACTORED ---- const groundTruthSetUtteranceEntityLabelsMap: { [id: string]: Label[] } = {};
    // ---- NOTE-REFACTORED ---- const groundTruthSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    // ---- NOTE-REFACTORED ---- const groundTruthSetJsonObjectArray: any = fs.readJsonSync(groundTruthFile);
    // ---- NOTE-REFACTORED ---- OrchestratorHelper.getJsonIntentsEntitiesUtterances(
    // ---- NOTE-REFACTORED ----   groundTruthSetJsonObjectArray,
    // ---- NOTE-REFACTORED ----   '',
    // ---- NOTE-REFACTORED ----   groundTruthSetUtteranceLabelsMap,
    // ---- NOTE-REFACTORED ----   groundTruthSetUtteranceLabelDuplicateMap,
    // ---- NOTE-REFACTORED ----   groundTruthSetUtteranceEntityLabelsMap,
    // ---- NOTE-REFACTORED ----   groundTruthSetUtteranceEntityLabelDuplicateMap);
    // ---- NOTE-REFACTORED ---- Utility.processUnknowLabelsInUtteranceLabelsMap(
    // ---- NOTE-REFACTORED ----   {
    // ---- NOTE-REFACTORED ----     utteranceLabelsMap: groundTruthSetUtteranceLabelsMap,
    // ---- NOTE-REFACTORED ----     utteranceLabelDuplicateMap: groundTruthSetUtteranceLabelDuplicateMap,
    // ---- NOTE-REFACTORED ----   });
    Utility.debuggingLog('OrchestratorAssess.runAsync(), after calling OrchestratorHelper.getJsonIntentsEntitiesUtterances() for groundTruth set');
    const groundTruthSetLabels: string[] =
      [...Object.values(groundTruthSetUtteranceLabelsMap)].reduce(
        (accumulant: string[], entry: string[]) => accumulant.concat(entry), []);
    const groundTruthSetLabelSet: Set<string> =
      new Set<string>(groundTruthSetLabels);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(groundTruthSetLabelSet)=${JSON.stringify(groundTruthSetLabelSet)}`);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(groundTruthSetUtteranceLabelsMap)=${JSON.stringify(groundTruthSetUtteranceLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(groundTruthSetUtteranceLabelDuplicateMap))=${JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(groundTruthSetUtteranceLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of ground-truth set unique utterances=${Object.keys(groundTruthSetUtteranceLabelsMap).length}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of ground-truth set duplicate utterance/label pairs=${groundTruthSetUtteranceLabelDuplicateMap.size}`);
    const groundTruthSetEntityLabels: string[] =
      [...Object.values(groundTruthSetUtteranceEntityLabelsMap)].reduce(
        (accumulant: string[], entry: Label[]) => accumulant.concat(entry.map((x: Label) => x.name)), []);
    const groundTruthSetEntityLabelSet: Set<string> =
      new Set<string>(groundTruthSetEntityLabels);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(groundTruthSetEntityLabelSet)=${JSON.stringify(groundTruthSetEntityLabelSet)}`);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(groundTruthSetUtteranceEntityLabelsMap)=${JSON.stringify(groundTruthSetUtteranceEntityLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(groundTruthSetUtteranceEntityLabelDuplicateMap))=${JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(groundTruthSetUtteranceEntityLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of ground-truth entity set unique utterances=${Object.keys(groundTruthSetUtteranceEntityLabelsMap).length}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of ground-truth entity set duplicate utterance/label pairs=${groundTruthSetUtteranceEntityLabelDuplicateMap.size}`);
    // -----------------------------------------------------------------------
    // ---- NOTE ---- process the prediction set, retrieve labels ------------
    const predictionFileProcessedUtteranceLabelsMap: {
      'utteranceLabelsMap': { [id: string]: string[] };
      'utteranceLabelDuplicateMap': Map<string, Set<string>>;
      'utteranceEntityLabelsMap': { [id: string]: Label[] };
      'utteranceEntityLabelDuplicateMap': Map<string, Label[]>; } =
      await OrchestratorHelper.getUtteranceLabelsMap(predictionFile, false);
    const predictionSetUtteranceLabelsMap: { [id: string]: string[] } =
      predictionFileProcessedUtteranceLabelsMap.utteranceLabelsMap;
    const predictionSetUtteranceLabelDuplicateMap: Map<string, Set<string>> =
      predictionFileProcessedUtteranceLabelsMap.utteranceLabelDuplicateMap;
    const predictionSetUtteranceEntityLabelsMap: { [id: string]: Label[] } =
      predictionFileProcessedUtteranceLabelsMap.utteranceEntityLabelsMap;
    const predictionSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]> =
      predictionFileProcessedUtteranceLabelsMap.utteranceEntityLabelDuplicateMap;
    // ---- NOTE-REFACTORED ---- const predictionSetUtteranceLabelsMap: { [id: string]: string[] } = {};
    // ---- NOTE-REFACTORED ---- const predictionSetUtteranceLabelDuplicateMap: Map<string, Set<string>> = new Map<string, Set<string>>();
    // ---- NOTE-REFACTORED ---- const predictionSetUtteranceEntityLabelsMap: { [id: string]: Label[] } = {};
    // ---- NOTE-REFACTORED ---- const predictionSetUtteranceEntityLabelDuplicateMap: Map<string, Label[]> = new Map<string, Label[]>();
    // ---- NOTE-REFACTORED ---- const predictionSetJsonObjectArray: any = fs.readJsonSync(predictionFile);
    // ---- NOTE-REFACTORED ---- OrchestratorHelper.getJsonIntentsEntitiesUtterances(
    // ---- NOTE-REFACTORED ----   predictionSetJsonObjectArray,
    // ---- NOTE-REFACTORED ----   '',
    // ---- NOTE-REFACTORED ----   predictionSetUtteranceLabelsMap,
    // ---- NOTE-REFACTORED ----   predictionSetUtteranceLabelDuplicateMap,
    // ---- NOTE-REFACTORED ----   predictionSetUtteranceEntityLabelsMap,
    // ---- NOTE-REFACTORED ----   predictionSetUtteranceEntityLabelDuplicateMap);
    Utility.processUnknowLabelsInUtteranceLabelsMapUsingLabelSet(
      {
        utteranceLabelsMap: predictionSetUtteranceLabelsMap,
        utteranceLabelDuplicateMap: predictionSetUtteranceLabelDuplicateMap,
      },
      groundTruthSetLabelSet);
    Utility.debuggingLog('OrchestratorAssess.runAsync(), after calling OrchestratorHelper.getJsonIntentsEntitiesUtterances() for prediction set');
    const predictionSetLabels: string[] =
      [...Object.values(predictionSetUtteranceLabelsMap)].reduce(
        (accumulant: string[], entry: string[]) => accumulant.concat(entry), []);
    const predictionSetLabelSet: Set<string> =
      new Set<string>(predictionSetLabels);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(predictionSetUtteranceLabelsMap)=${JSON.stringify(predictionSetUtteranceLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(predictionSetUtteranceLabelDuplicateMap))=${JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(predictionSetUtteranceLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of prediction-set duplicate utterance/label pairs=${predictionSetUtteranceLabelDuplicateMap.size}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of prediction set unique utterances=${Object.keys(predictionSetUtteranceLabelsMap).length}`);
    // if (Object.entries(predictionSetUtteranceLabelsMap).length <= 0) {
    //   Utility.debuggingThrow('there is no example, something wrong?');
    // }
    const predictionSetEntityLabels: string[] =
      [...Object.values(predictionSetUtteranceEntityLabelsMap)].reduce(
        (accumulant: string[], entry: Label[]) => accumulant.concat(entry.map((x: Label) => x.name)), []);
    const predictionSetEntityLabelSet: Set<string> =
      new Set<string>(predictionSetEntityLabels);
    // Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(predictionSetUtteranceEntityLabelsMap)=${JSON.stringify(predictionSetUtteranceEntityLabelsMap)}`);
    // ---- Utility.debuggingLog(`OrchestratorAssess.runAsync(), JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(predictionSetUtteranceEntityLabelDuplicateMap))=${JSON.stringify(Utility.convertStringKeyGenericSetNativeMapToDictionary<string>(predictionSetUtteranceEntityLabelDuplicateMap))}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of prediction set entity unique utterances=${Object.keys(predictionSetUtteranceEntityLabelsMap).length}`);
    Utility.debuggingLog(`OrchestratorAssess.runAsync(), number of prediction-set entity duplicate utterance/label pairs=${predictionSetUtteranceEntityLabelDuplicateMap.size}`);
    // if (Object.entries(predictionSetUtteranceEntityLabelsMap).length <= 0) {
    //   Utility.debuggingThrow('there is no entity example, something wrong?');
    // }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis reports ------------
    Utility.debuggingLog('OrchestratorAssess.runAsync(), ready to call Utility.generateAssessmentEvaluationReport()');
    const intentEvaluationOutput: {
      'evaluationReportGroundTruthSetLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': {[id: string]: number};};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': { [id: string]: string[] };
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': {[id: number]: number};
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportPredictionSetLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': {[id: string]: number};};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': { [id: string]: string[] };
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': {[id: number]: number};
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportSpuriousPredictions': {
        'evaluationSummary': string;
        'spuriousPredictions': [string, string[]][]; };
      'evaluationReportAnalyses': {
        'evaluationSummary': string;
        'misclassifiedAnalysis': {
          'predictingMisclassifiedUtterancesArrays': string[][];
          'predictingMisclassifiedUtterancesArraysHtml': string;
          'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
        'confusionMatrixAnalysis': {
          'confusionMatrix': IConfusionMatrix;
          'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
          'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;}; };
      'predictionStructureArray': PredictionStructure[];
    } =
    Utility.generateAssessmentEvaluationReport(
      groundTruthSetLabels,
      predictionSetLabelSet,
      groundTruthSetUtteranceLabelsMap,
      groundTruthSetUtteranceLabelDuplicateMap,
      predictionSetUtteranceLabelsMap,
      predictionSetUtteranceLabelDuplicateMap);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`intentEvaluationOutput=${Utility.jsonStringify(intentEvaluationOutput)}`);
    }
    Utility.debuggingLog('OrchestratorAssess.runAsync(), finished calling Utility.generateAssessmentEvaluationReport()');
    // ---- NOTE ---- integrated step to produce analysis report output files.
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`OrchestratorAssess.runAsync(), intentEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary=\n${intentEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    let intentEvaluationSummary: string =
      intentEvaluationOutput.evaluationReportAnalyses.evaluationSummary;
    // -----------------------------------------------------------------------
    intentEvaluationSummary = intentEvaluationSummary.replace(
      '{APP_NAME}',
      '');
    intentEvaluationSummary = intentEvaluationSummary.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateAssessmentEvaluationReportFiles(
      intentEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      intentEvaluationSummary,
      assessmentSetIntentLabelsOutputFilename,
      assessmentSetIntentSummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorAssess.runAsync(), finished calling Utility.generateAssessmentEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`intentEvaluationOutput=${Utility.jsonStringify(intentEvaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis reports ------------
    Utility.debuggingLog('OrchestratorAssess.runAsync(), ready to call Utility.generateAssessmentEvaluationReport()');
    const entityEvaluationOutput: {
      'evaluationReportGroundTruthSetLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': {[id: string]: number};};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': { [id: string]: string[] };
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': {[id: number]: number};
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportPredictionSetLabelUtteranceStatistics': {
        'evaluationSummary': string;
        'labelArrayAndMap': {
          'stringArray': string[];
          'stringMap': {[id: string]: number};};
        'labelStatisticsAndHtmlTable': {
          'labelUtterancesMap': { [id: string]: string[] };
          'labelUtterancesTotal': number;
          'labelStatistics': string[][];
          'labelStatisticsHtml': string;};
        'utteranceStatisticsAndHtmlTable': {
          'utteranceStatisticsMap': {[id: number]: number};
          'utteranceStatistics': [string, number][];
          'utteranceCount': number;
          'utteranceStatisticsHtml': string;};
        'utterancesMultiLabelArrays': [string, string][];
        'utterancesMultiLabelArraysHtml': string;
        'utteranceLabelDuplicateHtml': string; };
      'evaluationReportSpuriousPredictions': {
        'evaluationSummary': string;
        'spuriousPredictions': [string, Label[]][]; };
      'evaluationReportAnalyses': {
        'evaluationSummary': string;
        'misclassifiedAnalysis': {
          'predictingMisclassifiedUtterancesArrays': string[][];
          'predictingMisclassifiedUtterancesArraysHtml': string;
          'predictingMisclassifiedUtterancesSimpleArrays': string[][];};
        'confusionMatrixAnalysis': {
          'confusionMatrix': IConfusionMatrix;
          'multiLabelConfusionMatrixExact': MultiLabelConfusionMatrixExact;
          'multiLabelConfusionMatrixSubset': MultiLabelConfusionMatrixSubset;
          'predictingConfusionMatrixOutputLines': string[][];
          'confusionMatrixMetricsHtml': string;
          'confusionMatrixAverageMetricsHtml': string;}; };
      'predictionLabelStructureArray': PredictionLabelStructure[];
    } =
    Utility.generateAssessmentLabelObjectEvaluationReport(
      groundTruthSetEntityLabels,
      predictionSetEntityLabelSet,
      groundTruthSetUtteranceEntityLabelsMap,
      groundTruthSetUtteranceEntityLabelDuplicateMap,
      predictionSetUtteranceEntityLabelsMap,
      predictionSetUtteranceEntityLabelDuplicateMap);
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`entityEvaluationOutput=${Utility.jsonStringify(entityEvaluationOutput)}`);
    }
    Utility.debuggingLog('OrchestratorAssess.runAsync(), finished calling Utility.generateAssessmentEvaluationReport()');
    // -----------------------------------------------------------------------
    // ---- NOTE ---- integrated step to produce analysis report output files.
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`OrchestratorAssess.runAsync(), entityEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary=\n${entityEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.evaluationSummary}`);
    }
    let entityEvaluationSummary: string =
      entityEvaluationOutput.evaluationReportAnalyses.evaluationSummary;
    // -----------------------------------------------------------------------
    entityEvaluationSummary = entityEvaluationSummary.replace(
      '{APP_NAME}',
      '');
    entityEvaluationSummary = entityEvaluationSummary.replace(
      '{MODEL_SPECIFICATION}',
      '');
    // -----------------------------------------------------------------------
    Utility.generateAssessmentEvaluationReportFiles(
      entityEvaluationOutput.evaluationReportGroundTruthSetLabelUtteranceStatistics.labelArrayAndMap.stringArray,
      entityEvaluationSummary,
      assessmentSetEntityLabelsOutputFilename,
      assessmentSetEntitySummaryHtmlOutputFilename);
    Utility.debuggingLog('OrchestratorAssess.runAsync(), finished calling Utility.generateAssessmentEvaluationReportFiles()');
    if (Utility.toPrintDetailedDebuggingLogToConsole) {
      Utility.debuggingLog(`entityEvaluationOutput=${Utility.jsonStringify(entityEvaluationOutput)}`);
    }
    // -----------------------------------------------------------------------
    // ---- NOTE ---- THE END
    Utility.debuggingLog('OrchestratorAssess.runAsync(), THE END');
  }
}
