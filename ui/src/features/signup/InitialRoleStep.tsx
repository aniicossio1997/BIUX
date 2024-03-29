import {
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Icon,
  PinInput,
  PinInputField,
  RadioGroup,
  RadioProps,
  SimpleGrid,
  Text,
  Tooltip,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import { useState, SVGProps, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { StudentIcon2, TeacherIcon } from '../../components/common/Icons';
import { InfoIcon } from '@chakra-ui/icons';
import BAlert from '../../components/common/BAlert';
import { BRoutes } from '../../router/routes';
import Role from '../../model/user/Role';
import InstructorService from '../../services/api/InstructorService';

const options = [
  {
    title: 'Alumno',
    description: 'Soy un alumno de ciclismo con un instructor a cargo que desea mejorar en su progreso personal.',
    value: 'STUDENT',
    icon: StudentIcon2,
  },
  {
    title: 'Instructor',
    description: 'Soy un instructor de ciclismo deseando mejorar el control sobre el progreso de mis alumnos.',
    value: 'INSTRUCTOR',
    icon: TeacherIcon,
  },
];

interface Props {
  onSuccess: (role: Role, accessCode?: string, instructorId?: number, instructorName?: string) => void;
  initialData: { role?: Role; accessCode?: string };
}

const InitialRoleStep = ({ onSuccess, initialData }: Props) => {
  const [role, setRole] = useState<Role | undefined>(initialData.role);
  const [accessCode, setAccessCode] = useState<string | undefined>(initialData.accessCode);
  const [error, setError] = useState<string | null>();
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { getRadioProps } = useRadioGroup({
    name: 'Tipo de usuario',
    onChange: (v) => {
      setRole(v as Role);
    },
    defaultValue: '',
    value: role,
  });

  const invalidCode = useMemo(() => {
    return role == Role.STUDENT && (!accessCode?.length || accessCode?.length < 6);
  }, [accessCode, role]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setHasSubmitted(true);

    if (!role) return;
    if (role === Role.INSTRUCTOR) {
      onSuccess(Role.INSTRUCTOR);
      return;
    }
    // STUDENT
    if (!accessCode?.length || accessCode.length < 6) return;
    setLoading(true);
    const res = await InstructorService.checkCode(accessCode);
    if (res.hasError || !res.data.valid) {
      setError('El código de acceso ingresado no corresponde a ningún instructor.');
      setLoading(false);
      return;
    }
    const user = res.data.user;
    onSuccess(role, accessCode, user.id, `${user.firstName} ${user.lastName}`);
  };

  useEffect(() => {
    if (searchParams.get('tipo') == 'alumno') {
      setRole(Role.STUDENT);
    }
    if (searchParams.get('tipo') == 'instructor') {
      setRole(Role.INSTRUCTOR);
    }
  }, []);

  return (
    <>
      <Flex as='form' direction='column' grow={1} onSubmit={onSubmit}>
        <Heading>¡Registrate!</Heading>
        <BAlert mt={3} status='error' description={error} closable autoFocus onClose={() => setError(null)} />
        <Text color='text.300' mt={4} as='legend'>
          ¿Cuál de estas dos opciones te describe mejor como usuario?
        </Text>
        <Flex my={4}>
          <RadioGroup>
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
              {options.map((option) => {
                const radio = getRadioProps({ value: option.value });
                return <InitialRoleOption {...option} {...radio} key={option.value} />;
              })}
            </SimpleGrid>
          </RadioGroup>
        </Flex>

        <Collapse in={role == 'STUDENT'} unmountOnExit>
          <FormControl padding={3} paddingTop={0} isInvalid={hasSubmitted && invalidCode}>
            <FormLabel htmlFor='access-code-0' fontSize='lg' fontWeight='bold' marginBottom={0}>
              Código de acceso *
            </FormLabel>
            <FormHelperText marginTop={0} marginBottom={2}>
              <InfoIcon marginTop='-4px' /> Introduce el código acceso brindado por tu instructor para poder unirte a su grupo.
            </FormHelperText>
            <HStack spacing={[1, 2]}>
              <PinInput
                isInvalid={hasSubmitted && invalidCode}
                id='access-code'
                type='alphanumeric'
                size={{ base: 'md', md: 'lg' }}
                onChange={(v) => setAccessCode(v.toUpperCase())}
                value={accessCode}
              >
                <PinInputField />
                {[...Array(5)].map((_, index) => (
                  <PinInputField key={index} />
                ))}
              </PinInput>
            </HStack>
            <FormErrorMessage marginTop={0} marginBottom={2} color='red.600' _dark={{ color: 'red.300' }}>
              Introduce un código acceso válido
            </FormErrorMessage>
          </FormControl>
        </Collapse>
        <Flex justifyContent='space-between' grow={1} alignItems='end'>
          <Text textAlign={'start'} mt={2} ml={[0, 5]}>
            ¿Ya estas registrado?{' '}
            <Link to={BRoutes.LOGIN}>
              <b style={{ display: 'inline-flex' }}>Iniciar Sesión</b>
            </Link>
          </Text>
          <Tooltip hasArrow label={!role ? 'Por favor selecciona una opción' : null}>
            <Button size='lg' colorScheme='primary' type='submit' isDisabled={!role} isLoading={loading}>
              Continuar
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
};

interface InitialRoleOptionProps extends RadioProps {
  title: string;
  description: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

const InitialRoleOption = (props: InitialRoleOptionProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as='label' display='inline-flex' margin={1}>
      <input {...input} />
      <Box
        {...checkbox}
        className='selectable-item'
        _focusVisible={{
          boxShadow: 'outline',
        }}
        border='1px solid'
        borderColor='chakra-border-color'
        padding={{ base: 3, md: 5 }}
      >
        <Flex alignItems='start' direction={['row', 'column']} gap={1}>
          <Icon as={props.icon} boxSize='40px' marginRight={2} />
          <Heading size='lg'>{props.title}</Heading>
        </Flex>
        <Text>{props.description} </Text>
      </Box>
    </Box>
  );
};

export default InitialRoleStep;
