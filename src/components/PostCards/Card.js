import React, { useState } from 'react';
import { Box, Flex, Text, Image, Avatar, Button, Input, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { User, Trash2, Edit } from 'lucide-react';
import styles from './PostCard.module.css';

const Card = ({ post, user, onPostDelete, onPostUpdate }) => {
  const apiUrl = 'http://localhost:8080';
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedDescription, setEditedDescription] = useState(post.description);
  const [editedImage, setEditedImage] = useState(null);

  const handleDelete = async () => {
    try {
      const password = "password";
      const token = btoa(`${user.username}:${password}`);
      
      await axios.delete(`${apiUrl}/api/posts/${post.id}`, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (onPostDelete) {
        onPostDelete(post.id);
      }
    } 
    catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const password = "password";
      const token = btoa(`${user.username}:${password}`);
      
      const formData = new FormData();
      formData.append('title', editedTitle);
      formData.append('description', editedDescription);
      if (editedImage) {
        formData.append('image', editedImage);
      }

      const response = await axios.put(`${apiUrl}/api/posts/${post.id}`, 
        formData,
        {
          headers: {
            'Authorization': `Basic ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setIsEditing(false);
      if (onPostUpdate) {
        onPostUpdate(response.data);
      }
    } 
    catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(post.title);
    setEditedDescription(post.description);
    setEditedImage(null);
  };
  
  return (
    <Box className={styles.container}>
      <Box className={styles.content}>
        
        <Flex className={styles.userInfo}>
          <Box className={styles.avatar}>
            {user.profilePictureURL ? (
              <Avatar 
                src={user.profilePictureURL}
                name={user.username}
                width="60px"
                height="60px"
              />
            ) : (
              <User size={24} color="#FFFFFF" />
            )}
          </Box>

          <Box>
            <Text className={styles.username}>{user.username}</Text>
            <Text className={styles.timestamp}>
              {formatDistanceToNow(new Date(post.postAt), { addSuffix: true })}
            </Text>
          </Box>
        </Flex>

        {isEditing ? (
          <>
            <Input 
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className={styles.editInput}
            />
            <Textarea 
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className={styles.editTextarea}
            />
            <Input 
              type="file"
              onChange={(e) => setEditedImage(e.target.files[0])}
              className={styles.editInput}
            />
            <Button onClick={handleUpdate} colorScheme="green" mr={2}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <>
            {post.imageURL && (
              <Image
                src={post.imageURL}
                alt={post.title}
                className={styles.image}
              />
            )}
            <Text className={styles.title}>{post.title}</Text>
            <Text className={styles.description}>{post.description}</Text>
            
            <Button
              leftIcon={<Edit />}
              colorScheme="blue"
              variant="outline"
              size="sm"
              onClick={handleEdit}
              mr={2}
              mt={4}
            >
              Edit
            </Button>
            <Button
              leftIcon={<Trash2 />}
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              mt={4}
            >
              Delete
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Card;