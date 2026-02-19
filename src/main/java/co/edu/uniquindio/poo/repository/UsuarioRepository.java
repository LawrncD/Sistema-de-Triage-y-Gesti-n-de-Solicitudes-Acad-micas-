package co.edu.uniquindio.poo.repository;

import co.edu.uniquindio.poo.model.entity.Usuario;
import co.edu.uniquindio.poo.model.enums.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad Usuario.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByIdentificacion(String identificacion);

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByRol(Rol rol);

    List<Usuario> findByActivoTrue();

    List<Usuario> findByRolAndActivoTrue(Rol rol);

    boolean existsByIdentificacion(String identificacion);

    boolean existsByEmail(String email);
}
