package com.gerenciadordentedeleao.gerenciador_dente_de_leao.domain.user;

import com.gerenciadordentedeleao.gerenciador_dente_de_leao.domain.user.dto.RequestLoginDTO;
import com.gerenciadordentedeleao.gerenciador_dente_de_leao.domain.user.dto.ResponseLoginDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @PostMapping(value = "/login")
    public ResponseEntity<ResponseLoginDTO> login(@RequestBody RequestLoginDTO requestLoginDTO) {

        return ResponseEntity.ok(new ResponseLoginDTO("Barear 5I3yJExspXSsfTwjP8ZqhBAjGmY7aaDIz8tKw7HUWYJZ6xZMDjl347HPAwaIwz6s"));
    }
}
