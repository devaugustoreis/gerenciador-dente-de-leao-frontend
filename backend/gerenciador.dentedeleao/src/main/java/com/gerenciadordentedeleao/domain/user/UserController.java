package com.gerenciadordentedeleao.domain.user;

import com.gerenciadordentedeleao.application.authorization.TokenService;
import com.gerenciadordentedeleao.domain.user.dto.RequestLoginDTO;
import com.gerenciadordentedeleao.domain.user.dto.ResponseLoginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/user")
public class UserController {

    private final AuthenticationManager authenticationManager;

    private final TokenService tokenService;

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder encoder;

    @Autowired
    public UserController(AuthenticationManager authenticationManager, TokenService tokenService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.encoder = new BCryptPasswordEncoder();
    }

    @PostMapping(value = "/login")
    public ResponseEntity<ResponseLoginDTO> login(@RequestBody RequestLoginDTO request) {
        var userNamePassword = new UsernamePasswordAuthenticationToken(request.username(), request.password());
        Authentication auth = authenticationManager.authenticate(userNamePassword);
        String token = tokenService.generateToken((UserEntity) auth.getPrincipal());
        return ResponseEntity.ok(new ResponseLoginDTO(token));
    }

    @PostMapping(value = "/create")
    public void create(@RequestBody RequestLoginDTO request) {
        UserEntity user = new UserEntity();
        user.setLogin(request.username());
        user.setPassword(encoder.encode(request.password()));
        user.setRole(UserRole.ADMIN);
        user.setFullName("fulName");
        userRepository.save(user);
    }
}
