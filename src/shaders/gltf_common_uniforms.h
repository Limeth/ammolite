layout(set = 0, binding = 0) uniform SceneUBO {
    float time_elapsed;
    vec2 dimensions;
    vec3 camera_position;
    mat4 view;
    mat4 projection;
};

layout(set = 1, binding = 0) uniform InstanceUBO {
    mat4 model;
};

layout(set = 2, binding = 0) uniform NodeUBO {
    mat4 matrix;
};

layout(set = 3, binding = 0) uniform MaterialUBO {
    float alpha_cutoff;

    bool base_color_texture_provided;
    vec4 base_color_factor;

    bool metallic_roughness_texture_provided;
    vec2 metallic_roughness_factor;

    bool normal_texture_provided;
    float normal_texture_scale;

    bool occlusion_texture_provided;
    float occlusion_strength;

    bool emissive_texture_provided;
    vec3 emissive_factor;
};
layout(set = 3, binding =  1) uniform texture2D base_color_texture;
layout(set = 3, binding =  2) uniform sampler base_color_sampler;
layout(set = 3, binding =  3) uniform texture2D metallic_roughness_texture;
layout(set = 3, binding =  4) uniform sampler metallic_roughness_sampler;
layout(set = 3, binding =  5) uniform texture2D normal_texture;
layout(set = 3, binding =  6) uniform sampler normal_sampler;
layout(set = 3, binding =  7) uniform texture2D occlusion_texture;
layout(set = 3, binding =  8) uniform sampler occlusion_sampler;
layout(set = 3, binding =  9) uniform texture2D emissive_texture;
layout(set = 3, binding = 10) uniform sampler emissive_sampler;

layout(push_constant) uniform PushConstants {
    bool vertex_color_provided;
};
