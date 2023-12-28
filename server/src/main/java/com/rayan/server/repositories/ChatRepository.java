package com.rayan.server.repositories;

import com.rayan.server.models.Chat;
import com.rayan.server.models.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    /**
     * Find all chat messages from a conversation
     */
    List<Chat> findByConversation(Conversation conversation);
}
