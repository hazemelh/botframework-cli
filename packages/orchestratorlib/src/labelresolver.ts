/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';

import {Label} from '@microsoft/bf-dispatcher';
import {LabelType} from '@microsoft/bf-dispatcher';
import {OrchestratorHelper} from './orchestratorhelper';
import {Utility} from './utility';

const oc: any = require('orchestrator-core');

export class LabelResolver {
  public static Orchestrator: any;

  public static LabelResolver: any;

  public static async loadNlrAsync(baseModelPath: string, entityBaseModelPath: string = '') {
    Utility.debuggingLog('LabelResolver.loadNlrAsync(): creating Orchestrator.');
    Utility.debuggingLog(`LabelResolver.loadNlrAsync(): baseModelPath=${baseModelPath}`);
    Utility.debuggingLog(`LabelResolver.loadNlrAsync(): entityBaseModelPath=${entityBaseModelPath}`);
    if (baseModelPath) {
      baseModelPath = path.resolve(baseModelPath);
    }
    if (entityBaseModelPath) {
      entityBaseModelPath = path.resolve(entityBaseModelPath);
    }
    Utility.debuggingLog(`LabelResolver.loadNlrAsync(): baseModelPath-resolved=${baseModelPath}`);
    Utility.debuggingLog(`LabelResolver.loadNlrAsync(): entityBaseModelPath-resolved=${entityBaseModelPath}`);
    const hasBaseModel: boolean = !Utility.isEmptyString(baseModelPath);
    const hasEntityBaseModel: boolean = !Utility.isEmptyString(entityBaseModelPath);
    LabelResolver.Orchestrator = new oc.Orchestrator();
    if (hasBaseModel) {
      if (hasEntityBaseModel) {
        Utility.debuggingLog('LabelResolver.loadNlrAsync(): loading intent and entity base model');
        if (await LabelResolver.Orchestrator.loadAsync(baseModelPath, entityBaseModelPath) === false) {
          throw new Error(`Failed calling LabelResolver.Orchestrator.loadAsync("${baseModelPath}, ${entityBaseModelPath}")!`);
        }
      } else {
        Utility.debuggingLog('LabelResolver.loadNlrAsync(): loading intent base model');
        if (await LabelResolver.Orchestrator.loadAsync(baseModelPath) === false) {
          throw new Error(`Failed calling LabelResolver.Orchestrator.loadAsync("${baseModelPath}")!`);
        }
      }
    } else if (LabelResolver.Orchestrator.load() === false) {
      Utility.debuggingLog('LabelResolver.loadNlrAsync(): no intent or entity base model');
      throw new Error('Failed calling LabelResolver.Orchestrator.load()!');
    }
    Utility.debuggingLog('LabelResolver.loadNlrAsync(): leaving.');
    return LabelResolver.Orchestrator;
  }

  public static createLabelResolver() {
    return LabelResolver.Orchestrator.createLabelResolver();
  }

  public static async createAsync(baseModelPath: string, entityBaseModelPath: string = '') {
    Utility.debuggingLog(`LabelResolver.createAsync(): baseModelPath=${baseModelPath}, entityBaseModelPath=${entityBaseModelPath}`);
    const hasEntityBaseModel: boolean = !Utility.isEmptyString(entityBaseModelPath);
    if (hasEntityBaseModel) {
      await LabelResolver.loadNlrAsync(baseModelPath, entityBaseModelPath);
    } else {
      await LabelResolver.loadNlrAsync(baseModelPath);
    }
    Utility.debuggingLog('LabelResolver.createAsync(): Creating label resolver.');
    LabelResolver.LabelResolver = LabelResolver.Orchestrator.createLabelResolver();
    Utility.debuggingLog('LabelResolver.createAsync(): Finished creating label resolver.');
    return LabelResolver.LabelResolver;
  }

  public static async createWithSnapshotAsync(baseModelPath: string, snapshotPath: string, entityBaseModelPath: string = '') {
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): baseModelPath=${baseModelPath}, entityBaseModelPath=${entityBaseModelPath}`);
    await LabelResolver.loadNlrAsync(baseModelPath, entityBaseModelPath);
    Utility.debuggingLog('LabelResolver.createWithSnapshotAsync(): loading a snapshot.');
    const snapshot: Uint8Array = OrchestratorHelper.getSnapshotFromFile(snapshotPath);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): typeof(snapshot)=${typeof snapshot}`);
    Utility.debuggingLog(`LabelResolver.createWithSnapshotAsync(): snapshot.byteLength=${snapshot.byteLength}`);
    Utility.debuggingLog('LabelResolver.createWithSnapshotAsync(): creating label resolver.');
    LabelResolver.LabelResolver = await LabelResolver.Orchestrator.createLabelResolver(snapshot);
    if (!LabelResolver.LabelResolver) {
      throw new Error('FAILED to create a LabelResolver object');
    }
    Utility.debuggingLog('LabelResolver.createWithSnapshotAsync(): finished creating label resolver.');
    return LabelResolver.LabelResolver;
  }

  public static createSnapshot(labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.createSnapshot();
  }

  public static addSnapshot(snapshot: any, prefix: string = '', labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.addSnapshot(snapshot, prefix);
  }

  public static addExample(example: any, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.addExample(example);
  }

  public static removeExample(example: any, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.removeExample(example);
  }

  public static removeLabel(label: string, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.removeLabel(label);
  }

  public static getExamples(labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.getExamples();
  }

  public static getLabels(labelType: LabelType, labelResolver: any = null) {
    Utility.debuggingLog('CALLING LabelResolver.getLabels()');
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    Utility.debuggingLog('LabelResolver.getLabels(), after calling LabelResolver.ensureLabelResolver()');
    Utility.debuggingLog(`LabelResolver.getLabels(), labelResolver=${labelResolver}`);
    const labels: any = labelResolver.getLabels(labelType);
    Utility.debuggingLog(`LabelResolver.getLabels(), labels=${labels}`);
    Utility.debuggingLog('LEAVING LabelResolver.getLabels()');
    return labels;
  }

  public static score(utterance: string, labelType: LabelType, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.score(utterance, labelType);
  }

  public static getConfigJson(labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.getConfigJson();
  }

  public static setRuntimeParams(config: string, resetAll: boolean, labelResolver: any = null) {
    labelResolver = LabelResolver.ensureLabelResolver(labelResolver);
    return labelResolver.setRuntimeParams(config, resetAll);
  }

  // eslint-disable-next-line complexity
  public static addExamples(
    utteranceIntentEntityLabels: {
      utteranceLabelsMap: Map<string, Set<string>>;
      utteranceLabelDuplicateMap: Map<string, Set<string>>;
      utteranceEntityLabelsMap: Map<string, Label[]>;
      utteranceEntityLabelDuplicateMap: Map<string, Label[]>; },
    labelResolver: any = null) {
    Utility.debuggingLog('CALLING LabelResolver.addExamples()');
    if (labelResolver === null) {
      labelResolver = LabelResolver.LabelResolver;
    }
    const utteranceLabelsMap: Map<string, Set<string>> = utteranceIntentEntityLabels.utteranceLabelsMap;
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceLabelsMap.size=${utteranceIntentEntityLabels.utteranceLabelsMap.size}`);
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceLabelDuplicateMap.size}`);
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceEntityLabelsMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelsMap.size}`);
    Utility.debuggingLog(`processed utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size=${utteranceIntentEntityLabels.utteranceEntityLabelDuplicateMap.size}`);
    let numberUtterancesProcessedUtteranceLabelsMap: number = 0;
    Utility.debuggingLog(`READY to call labelResolver.addExample() on utteranceLabelsMap utterances and labels, utteranceLabelsMap.size=${utteranceLabelsMap.size}`);
    // ---- Utility.toPrintDetailedDebuggingLogToConsole = true; // ---- NOTE ---- disable after detailed tracing is done.
    // eslint-disable-next-line guard-for-in
    for (const utterance of utteranceLabelsMap.keys()) {
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`processing utterance=${utterance}`);
      }
      const labels: Set<string> = utteranceLabelsMap.get(utterance) as Set<string>;
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`LabelResolver.addExample()-Intent: Added { labels.size: ${labels.size}, text: ${utterance} }`);
      }
      if (labels && (labels.size > 0)) {
        for (const label of labels) {
          try {
            const success: any = labelResolver.addExample({label: label, text: utterance});
            // eslint-disable-next-line max-depth
            if (success) {
              // eslint-disable-next-line max-depth
              if (Utility.toPrintDetailedDebuggingLogToConsole) {
                Utility.debuggingLog(`LabelResolver.addExample()-Intent: Added { label: ${label}, text: ${utterance} }`);
              }
            } else {
              Utility.debuggingLog(`LabelResolver.addExample()-Intent: Failed adding { label: ${label}, text: ${utterance} }`);
            }
          } catch (error) {
            Utility.debuggingLog(`LabelResolver.addExample()-Intent: Failed adding { label: ${label}, text: ${utterance} }\n${error}`);
          }
        }
      }
      numberUtterancesProcessedUtteranceLabelsMap++;
      if ((numberUtterancesProcessedUtteranceLabelsMap % Utility.NumberOfInstancesPerProgressDisplayBatch) === 0) {
        Utility.debuggingLog(`LabelResolver.addExample(): Added numberUtterancesProcessedUtteranceLabelsMap=${numberUtterancesProcessedUtteranceLabelsMap}`);
      }
    }
    const utteranceEntityLabelsMap: Map<string, Label[]> = utteranceIntentEntityLabels.utteranceEntityLabelsMap;
    Utility.debuggingLog(`READY to call labelResolver.addExample() on utteranceEntityLabelsMap utterances and labels, utteranceEntityLabelsMap.size=${utteranceEntityLabelsMap.size}`);
    // eslint-disable-next-line guard-for-in
    for (const utterance of utteranceEntityLabelsMap.keys()) {
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`processing utterance=${utterance}`);
      }
      const labels: Label[] = utteranceEntityLabelsMap.get(utterance) as Label[];
      if (Utility.toPrintDetailedDebuggingLogToConsole) {
        Utility.debuggingLog(`LabelResolver.addExample()-Entity: Added { labels.length: ${labels.length}, text: ${utterance} }`);
      }
      if (labels && (labels.length > 0)) {
        for (const label of labels) {
          const entity: string = label.name;
          const spanOffset: number = label.span.offset;
          const spanLength: number = label.span.length;
          try {
            const success: any = labelResolver.addExample({
              text: utterance,
              labels: [{
                name: entity,
                label_type: 2,
                span: {
                  offset: spanOffset,
                  length: spanLength}}]});
            // eslint-disable-next-line max-depth
            if (success) {
              // eslint-disable-next-line max-depth
              if (Utility.toPrintDetailedDebuggingLogToConsole) {
                Utility.debuggingLog(`LabelResolver.addExample()-Entity: Added { label: ${label}, text: ${utterance}, offset: ${spanOffset}, length: ${spanLength} }`);
              }
            } else {
              Utility.debuggingLog(`LabelResolver.addExample()-Entity: Failed adding { label: ${label}, text: ${utterance}, offset: ${spanOffset}, length: ${spanLength} }`);
            }
          } catch (error) {
            Utility.debuggingLog(`LabelResolver.addExample()-Entity: Failed adding { label: ${label}, text: ${utterance}, offset: ${spanOffset}, length: ${spanLength} }\n${error}`);
          }
        }
      }
    }
    Utility.debuggingLog('LEAVING LabelResolver.addExamples()');
  }

  private static ensureLabelResolver(labelResolver: any) {
    if (!labelResolver) {
      labelResolver = LabelResolver.LabelResolver;
    }
    if (!labelResolver) {
      throw new Error('LabelResolver was not initialized');
    }
    return labelResolver;
  }
}
