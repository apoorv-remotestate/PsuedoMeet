import { LiveKitRoom } from '@livekit/react-components';
import { Box, Grid, Stack, TextField } from '@mui/material';
import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createLocalVideoTrack, LocalVideoTrack } from 'livekit-client';
import { VideoRenderer } from '@livekit/react-core';

const Room = () => {
    const [test, setTest] = useState<string[]>([]);
    const [test2, setTest2] = useState<string>('');
    const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();

    const bubble = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (process.browser) {
            (bubble?.current?.lastChild as any)?.scrollIntoView();
        }
    }, [test]);

    useEffect(() => {
        // enable video by default
        createLocalVideoTrack().then((track) => {
            setVideoTrack(track);
        });
    }, []);

    const part = 4;

    const gridComp = useMemo(
        () => (
            <Grid
                // key={Math.random()}
                item
                xs={12}
                md={part > 1 ? 6 : 12}
            >
                <Box
                    sx={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {videoTrack ? (
                        <VideoRenderer
                            track={videoTrack}
                            isLocal={true}
                            width='100%'
                            height='100%'
                            objectFit='cover'
                        />
                    ) : null}
                </Box>
            </Grid>
        ),
        [part, videoTrack]
    );

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta
                    name='description'
                    content='Generated by create next app'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <Grid
                container
                sx={{
                    backgroundColor: '#000000',
                    height: '100vh',
                    padding: '10px',
                }}
                columnSpacing={1}
            >
                <Grid sx={{ height: '100%' }} item xs>
                    <Grid
                        container
                        direction={'column'}
                        sx={{
                            borderRadius: '10px',
                            border: '1px solid #fff',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            alignItems: 'center',
                            padding: '8px',
                            overflow: 'hidden',
                        }}
                    >
                        <Grid
                            item
                            xs={11}
                            sx={{ width: '100%', height: '100%' }}
                        >
                            <Grid
                                container
                                columnSpacing={1}
                                rowSpacing={1}
                                justifyContent={'center'}
                                alignItems={'center'}
                                sx={{ width: '100%', height: '100%' }}
                            >
                                {Array.from({ length: part }, (x, i) => i).map(
                                    (_) => {
                                        return gridComp;
                                    }
                                )}
                            </Grid>
                        </Grid>
                        <Grid item xs={1}>
                            <Box
                                sx={{
                                    backgroundColor: '#fff',
                                    borderRadius: '5px',
                                    width: '300px',
                                    height: '100%',
                                    minHeight: '50px',
                                    // margin: '10px',
                                }}
                            ></Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid sx={{ height: '100%' }} item xs={2}>
                    <Box
                        sx={{
                            borderRadius: '10px',
                            border: '1px solid #fff',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            '& ::-webkit-scrollbar': { display: 'none' },
                        }}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                backgroundColor: '#ffffff30',
                                borderRadius: '5px',
                                marginBottom: '10px',
                                height: '100%',
                                overflow: 'scroll',
                            }}
                            ref={bubble}
                        >
                            {test.map((test: string, index) => (
                                <Box
                                    sx={{ color: '#fff', padding: '10px' }}
                                    key={index}
                                >
                                    {test}
                                </Box>
                            ))}
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: '#ffffff30',
                                borderRadius: '5px',
                            }}
                        >
                            <TextField
                                value={test2}
                                onChange={(e) => {
                                    setTest2(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setTest((prev) => [...prev, test2]);
                                        setTest2('');
                                    }
                                }}
                                fullWidth
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default Room;
