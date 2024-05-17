import React from 'react';
import { Card, Stack, Avatar, Heading, Text, Box } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export const UserListing = ({ users, cardBg, cardHoverBg, textColor }) => {
    const router = useRouter();

    const handleUserDetails = (item) => {
        localStorage.setItem("userData", JSON.stringify(item));
        router.push(`/user/${item?.id}`);
    }
    return (
        users.map((item) => (
            <Card
                key={item.id} // Assuming each user has a unique id
                onClick={() => handleUserDetails(item)}
                cursor="pointer"
                bg={cardBg}
                _hover={{ bg: cardHoverBg, transform: "scale(1.02)" }}
                transition="all 0.2s"
                shadow="md"
                borderRadius="md"
                p={4}
            >
                <Stack direction="row" spacing={4} align="center">
                    <Avatar name={item.name} src="https://bit.ly/broken-link" />
                    <Heading size="md">{item.name}</Heading>
                </Stack>
                <Text color={textColor}>Email: {item.email}</Text>
                <Text color={textColor}>Gender: {item.gender}</Text>
                <Text color={textColor}>
                    Status:{" "}
                    <Box as="span" color={item.status === "active" ? "green.500" : "red.500"}>
                        {item.status}
                    </Box>
                </Text>
            </Card>
        ))
    );
};
