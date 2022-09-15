import { Box, Grid, TextField, Typography } from '@mui/material';
import Head from 'next/head';
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    createLocalVideoTrack,
    LocalVideoTrack,
    RoomOptions,
} from 'livekit-client';
import {
    VideoRenderer,
    AudioRenderer,
    useRoom,
    useParticipant,
} from '@livekit/react-core';
import { useRouter } from 'next/router';

export const ParticipantRenderer = ({ participant }: { participant: any }) => {
    const { isSpeaking, subscribedTracks } = useParticipant(participant);
};

const Room = () => {
    const [test, setTest] = useState<string[]>([]);
    const [test2, setTest2] = useState<string>('');
    const [chatMsgs, setChatMsgs] = useState<any>([]);
    const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
    const [token, setToken] = useState('');

    const roomOptions: RoomOptions = {
        adaptiveStream: true,
        dynacast: true,
    };
    const { connect, isConnecting, room, error, participants, audioTracks } =
        useRoom(roomOptions);
    const init = useCallback(async () => {
        const livekitUrl = 'ws://192.168.1.98:7880';
        const livekitToken = token;
        // initiate connection to the livekit room
        try {
            await connect(livekitUrl, livekitToken);
        } catch (err) {
            console.log(err);
        }
        // request camera and microphone permissions and publish tracks
        await room?.localParticipant?.enableCameraAndMicrophone();
    }, [connect, room?.localParticipant, token]);

    useEffect(() => {
        console.log(token, room);
        init().catch(console.error);
    }, [init, token, room]);

    const router = useRouter();

    const { url, userId, roomName } = router.query;

    const bubble = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (process.browser) {
            (bubble?.current?.lastChild as any)?.scrollIntoView();
        }
    }, [chatMsgs]);

    useEffect(() => {
        if (router.query.video === 'true')
            createLocalVideoTrack().then((track) => {
                setVideoTrack(track);
            });
    }, [router.query.video]);

    const part = 2;

    const socket = useRef({
        addEventListener: (a: any, b: any) => {},
        removeEventListener: (a: any, b: any) => {},
        readyState: 0,
        send: (a: any) => {},
    });

    const listenToMsgs = useCallback(async (event: any) => {
        if (socket.current.readyState === 1) {
            const test = await event.data.arrayBuffer();
            const res = JSON.parse(new TextDecoder().decode(test));
            if (res.type === 'create_room') {
                setToken(res.data.accessToken);
                return;
            }
            setChatMsgs((p: any) => [...p, res.messageText]);
        }
    }, []);

    useEffect(() => {
        if (url) {
            try {
                socket.current = new WebSocket(
                    // 'ws://192.168.1.47:8056/chat?userID=2&senderID=1'
                    // 'ws://dc88-223-233-79-230.in.ngrok.io/api/ws?userId=1'
                    // 'ws://192.168.1.98:8081/api/ws?userId=1'
                    `ws://${url}/api/ws?userId=${userId}&roomName=${roomName}`
                );

                socket.current.addEventListener('message', listenToMsgs);
            } catch (err) {
                console.log(err);
            }
        }
        return () => {
            socket.current.removeEventListener('message', listenToMsgs);
            // socket.current.close();
        };
    }, [listenToMsgs, roomName, url, userId]);

    useEffect(() => {
        console.log('readyState:', socket.current.readyState);
        if (socket.current.readyState === 1) {
            socket.current.send(
                new TextEncoder().encode(
                    JSON.stringify({
                        type: 'create_room',
                        data: {},
                    })
                )
            );
        }
    }, [socket.current.readyState]);

    const gridComp = useMemo(
        () => (
            <Grid item xs={12} md={part > 1 ? 6 : 12}>
                <Box
                    key='test'
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
                <Grid key='video' sx={{ height: '100%' }} item xs>
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
                <Grid key='chat' sx={{ height: '100%' }} item xs={2}>
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
                            {chatMsgs.map((msg: string, index: number) => (
                                <Box
                                    sx={{
                                        color: '#fff',
                                        padding: '10px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        // justifyContent: 'center',
                                        alignCenter: 'center',
                                    }}
                                    key={index}
                                >
                                    <Typography sx={{}}> {msg}</Typography>
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
                                        if (
                                            socket.current.readyState === 1 &&
                                            test2.length > 0
                                        ) {
                                            socket.current.send(
                                                new TextEncoder().encode(
                                                    JSON.stringify({
                                                        type: 'chat',
                                                        data: {
                                                            data: test2,
                                                            userIds: [1, 2],
                                                        },
                                                    })
                                                )
                                            );
                                            setTest2('');
                                        }
                                    }
                                }}
                                sx={{
                                    '& input': {
                                        color: '#fff',
                                    },
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
// export const ParticipantRenderer = ({ participant }) => {
//   const { isSpeaking, subscribedTracks } = useParticipant(participant)
// }
