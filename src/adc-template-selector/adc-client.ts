
/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ADCTemplate } from ".";
import { OAuthApi } from "@backstage/core-plugin-api";

class ADCClient {
    
    private googleAuth: OAuthApi;
    private baseURL: string = 'https://api.applicationdesigncenter.gcloud/';
    private tokenScope: string = 'https://www.googleapis.com/auth/cloud-platform';

    constructor(googleAuth: OAuthApi) {
        this.googleAuth = googleAuth;
    }

    async getGoogleOAuthToken() {
        return this.googleAuth.getAccessToken(this.tokenScope);
    }

    async getADCTemplates(googleOAuthToken: string) {
        try {
            // const response = await fetch(`${this.baseURL}/adctemplates`);
            const response: { ok: boolean, statusText: string, json: () => Promise<{ templates: ADCTemplate[] }> } = ({
                ok: true,
                statusText: 'response status text',
                json: () => new Promise(async (resolve) => {
                    setTimeout(() => {
                        resolve(({
                            templates: [{
                                id: 'cloudrun-react-python',
                                name: 'Cloud Run React SSR + Python',
                                description: 'Google Cloud'
                            }, 
                            {
                                id: 'rag-vertexai',
                                name: 'RAG VertexAI Bot Agent',
                                description: 'Google Cloud',
                                parameters: {
                                    bot_name: null,
                                    gemini_model: null,
                                    use_rag: null
                                }
                            },
                            {
                                id: 'dataflow-etl-cloudstorage',
                                name: 'Dataflow ETL with Cloud Storage',
                                description: 'Google Cloud',
                                parameters: {
                                    beam_version: null,
                                    bucket_name: null,
                                    region: null
                                }
                            },
                            {
                                id: 'dataflow-etl-bigquery',
                                name: 'Dataflow ETL with Big Query',
                                description: 'Google Cloud'
                            },
                            {
                                id: 'cloudrun-flask-python',
                                name: 'Cloud Run Flask Python function',
                                description: 'Google Cloud'
                            },
                            {
                                id: 'cloudsql-postgressql',
                                name: 'Cloud SQL for PostgreSQL',
                                description: 'Google Cloud'
                            },    {
                                id: 'dataflow-apachespark',
                                name: 'Dataflow Apache Spark job',
                                description: 'Google Cloud'
                            },
                            {
                                id: 'cloudrun-nextjs-httpmiddleware',
                                name: 'Cloud Run Next.js HTTP middleware',
                                description: 'Google Cloud'
                            },
                            {
                                id: 'memorystore-redis',
                                name: 'Memorystore Redis database',
                                description: 'Google Cloud',
                                parameters: {
                                    database_name: null,
                                    port: null,
                                    user: null,
                                    password: null
                                }
                            }
                        ]
                        }))
                    }, 2000)
                })
            })
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}

export default ADCClient;
