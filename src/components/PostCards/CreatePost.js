import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import styles from './Post.module.css';

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const apiUrl = 'http://localhost:8080';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title)
        formData.append('description', description);
        if (image) {
            formData.append('postImage', image);
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const password = "password";

            const token = btoa(`${user?.username}:${password}`)
            await axios.post(`${apiUrl}/api/posts/user/${user.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Basic ${token}`
                },
            });
            navigate('/dashboard', { state: { refresh: true } });
        }
        catch (error) {
            console.error('Error creating post:', error);
        }
    };
    
    return (  
        <div className={styles.createPost}>
            <Header />

            <main className={styles.main}>
                <Box maxWidth="600px" margin="auto" padding="20px">
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Image</FormLabel>
                            <Input 
                                type="file" 
                                onChange={(e) => setImage(e.target.files[0])} 
                            />
                        </FormControl>
                        <Button mt={4} colorScheme="blue" type="submit">
                            Create Post
                        </Button>
                    </form>
                </Box>
            </main>

            <Footer />
        </div>
    );
}
 
export default CreatePost;