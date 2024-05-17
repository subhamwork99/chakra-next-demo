import React from 'react';
import { Card, Stack, Heading, Text, Box, CardBody, StackDivider, Textarea, FormLabel, FormControl, Button, CardFooter } from '@chakra-ui/react';

export const PostListing = ({ userPosts, cardBg, textColor, comment, commentId, handleNewCommentChange, handleComment, handleAddNewComment, getComment, addNewComment }) => {
    return (
        userPosts.map((data, index) => (
            <Card
                cursor="pointer"
                bg={cardBg}
                transition="all 0.2s"
                shadow="md"
                borderRadius="md"
                p={4}
                w={{ sm: "100%", lg: "800px" }}
                h="100%"
                maxW="100%"
            >
                <CardBody>
                    <Stack divider={<StackDivider />} spacing="4">
                        <Box>
                            <Heading size="xs" textTransform="uppercase">
                                {data.title}
                            </Heading>
                            <Text pt="2" fontSize="sm" color={textColor}>
                                {data.body}
                            </Text>
                        </Box>
                        {comment && commentId === index && (
                            <Box>
                                <Box>
                                    {getComment?.map((comment) => (
                                        <Card style={{ marginBottom: "10px" }}>
                                            <CardBody style={{ padding: "5px 5px 5px 15px" }}>
                                                <Text fontSize="sm" color={textColor}>{comment?.body}</Text>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </Box>
                                <FormControl>
                                    <FormLabel>Comment</FormLabel>
                                    <Textarea
                                        name="comment"
                                        type="textarea"
                                        value={addNewComment}
                                        onChange={handleNewCommentChange}
                                        placeholder="Write here..."
                                        size="sm"
                                        resize={false}
                                    />
                                </FormControl>
                                <Button
                                    flex="1"
                                    variant="outline"
                                    onClick={() => handleAddNewComment(data, index)}
                                >
                                    Submit
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </CardBody>

                <CardFooter
                    justify="space-between"
                    flexWrap="wrap"
                    sx={{
                        "& > button": {
                            minW: "136px",
                        },
                    }}
                >
                    <Button
                        flex="1"
                        variant="ghost"
                        onClick={() => handleComment(data, index)}
                    >
                        Comment
                    </Button>
                </CardFooter>
            </Card>
        ))
    )
}