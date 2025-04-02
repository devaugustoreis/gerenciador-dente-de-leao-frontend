package com.gerenciadordentedeleao.application.authorization;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SpringAuthentication {

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public String getAuthenticatedUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
