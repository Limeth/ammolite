vec4 get_base_color(in bool base_color_texture_provided,
                    in vec4 base_color_factor,
                    in texture2D base_color_texture,
                    in sampler base_color_sampler,
                    in vec2 f_tex_coord) {
    if (base_color_texture_provided) {
        vec4 texture_value = texture(
            sampler2D(base_color_texture, base_color_sampler),
            vec2(f_tex_coord)
        );

        return base_color_factor * texture_value;
    } else {
        return base_color_factor;
    }
}

vec3 sample_normal(in bool normal_texture_provided,
                   in float normal_texture_scale,
                   in texture2D normal_texture,
                   in sampler normal_sampler,
                   in vec2 f_tex_coord) {
    if (!normal_texture_provided) {
        return vec3(0.0, 0.0, 1.0);
    }

    vec3 normal_sample = texture(
        sampler2D(normal_texture, normal_sampler),
        vec2(f_tex_coord)
    ).xyz;

    vec3 scaled_normal = normalize((normal_sample * 2.0 - 1.0)
            * vec3(normal_texture_scale, normal_texture_scale, 1.0));

    return scaled_normal;
}

vec4 get_final_color(in mat4 view,
                     in vec3 position,
                     in vec3 normal,
                     in vec4 tangent,
                     in bool base_color_texture_provided,
                     in vec4 base_color_factor,
                     in texture2D base_color_texture,
                     in sampler base_color_sampler,
                     in bool normal_texture_provided,
                     in float normal_texture_scale,
                     in texture2D normal_texture,
                     in sampler normal_sampler,
                     in vec2 f_tex_coord) {
    vec3 bitangent = cross(normal, tangent.xyz) * tangent.w;
    vec4 base_color = get_base_color(base_color_texture_provided,
                                     base_color_factor,
                                     base_color_texture,
                                     base_color_sampler,
                                     f_tex_coord);

    // Construct an orthonormal TBN matrix
    mat3 tangent_to_canonical = mat3(tangent.xyz, bitangent, normal);
    // We can use `transpose` to invert the matrix as it's orthonormal
    mat3 canonical_to_tangent = transpose(tangent_to_canonical);

    vec3 light_dir = vec3(0.0, 0.0, +1.0);
    float weight = clamp(dot(normal, light_dir), 0.0, 1.0);
    vec4 shaded = base_color * weight;
    vec4 result;

    vec3 sampled_normal = sample_normal(
        normal_texture_provided,
        normal_texture_scale,
        normal_texture,
        normal_sampler,
        f_tex_coord
    );

    if (gl_FragCoord.x > -0.3) {
        /* normal = normal_sample.x * tangent.xyz + normal_sample.y * bitangent + */
        /*     normal_sample.z * normal; */
        normal = tangent_to_canonical * sampled_normal;
        /* normal = normalize(normal); */
    }

    /* if (position.x < 0.3) { */
    /*     result = vec4(normal, 1.0); */
    /*     /1* result = vec4(dot(normal, normal), dot(tangent, tangent), dot(bitangent, bitangent), 1.0); *1/ */
    /* } else { */
    /*     result = texture( */
    /*         sampler2D(normal_texture, normal_sampler), */
    /*         vec2(f_tex_coord) */
    /*     ); */
    /* } */

    if (gl_FragCoord.x > 0.3) {
        normal = normalize(normal);
    }

    /* result = base_color * clamp(dot(normal, light_dir), 0.0, 1.0); */
    result = vec4(normal, 1.0);

    return result;
}
