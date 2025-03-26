package com.gerenciadordentedeleao.domain.user;

import com.gerenciadordentedeleao.application.authorization.TokenService;
import com.gerenciadordentedeleao.domain.user.dto.RequestLoginDTO;
import com.gerenciadordentedeleao.domain.user.dto.ResponseLoginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final AuthenticationManager authenticationManager;

    private final TokenService tokenService;

    @Autowired
    public UserController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<ResponseLoginDTO> login(@RequestBody RequestLoginDTO request) {
        var userNamePassword = new UsernamePasswordAuthenticationToken(request.userName(), request.password());
        Authentication auth = authenticationManager.authenticate(userNamePassword);
        String token = tokenService.generateToken((UserEntity) auth.getPrincipal());
        return ResponseEntity.ok(new ResponseLoginDTO(token));
    }
}
