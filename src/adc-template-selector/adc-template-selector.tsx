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

import React, { useEffect, useRef, useState } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import { Card, CardContent, Typography, Grid, FormControl, LinearProgress} from '@material-ui/core'; // Added Skeleton import
import Skeleton from '@material-ui/lab/Skeleton';
import type { FieldValidation } from '@rjsf/utils';
import { useApi, googleAuthApiRef } from '@backstage/core-plugin-api';
import { ADCTemplate } from '.';
import ADCClient from './adc-client';
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';

export const ADCTemplateSelector = ({
    onChange,
    rawErrors,
    required,
    formData,
}: FieldExtensionComponentProps<string>) => {
    const [templates, setTemplates] = useState<ADCTemplate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const googleAuth = useApi(googleAuthApiRef);
    const adcClient = useRef(new ADCClient(googleAuth)); 
    const {secrets, setSecrets} = useTemplateSecrets();

    useEffect(() => {
        const setGoogleOAuthToken = async () => {
            const token = await adcClient.current.getGoogleOAuthToken();
            if (token) {
                setSecrets({ googleOAuthToken: token })
            }
        }
        if (!secrets?.googleOAuthToken) {
            setGoogleOAuthToken();
        }
    }, [secrets, setSecrets])

    useEffect(() => {
        const fetchTemplates = async () => {
            const data = await adcClient.current.getADCTemplates(secrets.googleOAuthToken);
            setTemplates(data.templates);
            setLoading(false);
        };

        if (secrets.googleOAuthToken) {
            fetchTemplates();
        }

    }, [secrets?.googleOAuthToken, formData]);

    return (
        <FormControl   
             required={required}   
             error={rawErrors?.length > 0 && !formData}
        >
            <>
                {loading && <LinearProgress style={{marginBottom: '25px'}} />}
                <Grid container spacing={2}>
                    {loading ? ( 
                        Array.from(new Array(9)).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Skeleton variant="text" width="80%" height={30} />
                                        <Skeleton variant="text" width="60%" height={20} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        templates.map((template) => (
                            <Grid item xs={12} sm={6} md={4} key={template.id}>
                                <Card
                                    variant="outlined"
                                    onClick={() => {
                                        onChange(template.id);
                                    }}
                                    style={{    
                                        cursor: 'pointer',
                                        backgroundColor: formData === template.id ? 'rgba(0, 0, 0, 0.12)' : 'transparent',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{template.name}</Typography>
                                        <Typography variant="body2">{template.description}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </>
        </FormControl>
    );
};


export const validateADCTemplateSelector = (
    value: string,
    validation: FieldValidation,
  ) => {};