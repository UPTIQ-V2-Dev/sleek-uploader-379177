import { type ZodSchema } from 'zod';

type TriggerEvent =
    | {
          type: 'async';
          name: string;
          description: string;
      }
    | {
          type: 'sync';
          name: string;
          description: string;
          outputSchema: ZodSchema;
      };

export type AgentConfig = {
    id: string;
    name: string;
    description: string;
    triggerEvents: TriggerEvent[];
    config: {
        appId: string;
        accountId: string;
        widgetKey: string;
    };
};

export const AGENT_CONFIGS: AgentConfig[] = [
    {
        id: '17069010-f7e9-48ea-90de-bb78c90edfd7',
        name: 'Document Query Handler',
        description: 'An agent that efficiently manages and responds to document-related queries.',
        triggerEvents: [
            {
                type: 'async',
                name: 'document-uploaded',
                description: 'Fire when document is uploaded, documents are preferred'
            },
            {
                type: 'async',
                name: 'document-updated',
                description: 'Fire when document is updated, documents are preferred'
            }
        ],
        config: {
            appId: 'atharva-s-workspace',
            accountId: 'default-account',
            widgetKey: 'VWiBLPZOnRuMiFfNxO4QwKPAk67kAXmn7mboSAGB'
        }
    }
];
