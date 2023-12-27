package com.rayan.server.repositories;

import com.rayan.server.models.Chat;
import com.rayan.server.models.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    /**
     * Find all chat messages from a conversation
     */
    List<Chat> findByConversation(Conversation conversation);

    /**
     * Get last chat conversation message sent
     */
    //@Query(nativeQuery = true, value = "SELECT * from chat where conversationid=")
    //Chat findByConversationAndOrderByCreatedatDesc(Conversation conversation);
}
