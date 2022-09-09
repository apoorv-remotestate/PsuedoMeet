import { Box, Button } from '@mui/material';
import ReactSwipe from 'react-swipe';

const Swipe = () => {
    let test: any;
    return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#efefef',
                    padding: '50px 50px 0 50px',
                }}
            >
                <ReactSwipe
                    swipeOptions={{ continuous: true }}
                    ref={(el) => (test = el)}
                    style={{
                        container: {
                            overflow: 'hidden',
                            visibility: 'hidden',
                            position: 'relative',
                            borderRadius: '10px',
                        },
                        wrapper: {
                            overflow: 'hidden',
                            position: 'relative',
                        },
                        child: {
                            float: 'left',
                            width: '100%',
                            position: 'relative',
                            transitionProperty: 'transform',
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: '80vw',
                            height: '80vh',
                            backgroundColor: '#f00',
                        }}
                    ></Box>
                    <Box
                        sx={{
                            width: '80vw',
                            height: '80vh',
                            backgroundColor: '#0f0',
                            overflow: 'auto',
                            // display: 'flex',
                            // justifyContent: 'center',
                            // flexDirection: 'column',
                            // alignItems: 'center',
                            '& ::-webkit-scrollbar': { display: 'none' },
                        }}
                    >
                        <Box
                            sx={{
                                width: '80%',
                                height: '80%',
                                backgroundColor: '#f00',
                            }}
                        ></Box>
                        <Box
                            sx={{
                                width: '80%',
                                height: '80%',
                                backgroundColor: '#00f',
                            }}
                        ></Box>
                    </Box>
                    <Box
                        sx={{
                            width: '80vw',
                            height: '80vh',
                            backgroundColor: '#00f',
                        }}
                    ></Box>
                </ReactSwipe>
                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant={'contained'} onClick={() => test.next()}>
                        Next
                    </Button>
                    <Button variant={'contained'} onClick={() => test.prev()}>
                        Previous
                    </Button>
                </Box> */}
            </Box>
        </>
    );
};

export default Swipe;
